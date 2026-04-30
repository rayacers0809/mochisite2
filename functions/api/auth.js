// 메모리 기반 rate limiting (Workers KV 없이)
const attempts = new Map();
const blocked = new Map();

const CONFIG = {
  MAX_ATTEMPTS: 5,           // 최대 시도 횟수
  LOCK_TIME: 5 * 60 * 1000,  // 5분 잠금
  ATTEMPT_WINDOW: 60 * 1000, // 1분 내 시도 횟수 체크
  MIN_PW_LENGTH: 8,          // 최소 비밀번호 길이
};

// IP 추출
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 
         'unknown';
}

// 타이밍 공격 방지용 상수 시간 비교
function secureCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) {
    // 길이 다르면 더미 비교 후 false
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ a.charCodeAt(i);
    }
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// SHA-256 해시
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 랜덤 딜레이 (타이밍 공격 방지)
async function randomDelay() {
  const delay = Math.floor(Math.random() * 200) + 100; // 100-300ms
  await new Promise(r => setTimeout(r, delay));
}

// Rate limit 체크
function checkRateLimit(ip) {
  const now = Date.now();
  
  // 차단 상태 확인
  const blockUntil = blocked.get(ip);
  if (blockUntil && now < blockUntil) {
    const remaining = Math.ceil((blockUntil - now) / 1000);
    return { blocked: true, remaining };
  } else if (blockUntil) {
    blocked.delete(ip);
    attempts.delete(ip);
  }
  
  // 시도 횟수 확인
  const record = attempts.get(ip) || { count: 0, first: now };
  
  // 윈도우 초과시 리셋
  if (now - record.first > CONFIG.ATTEMPT_WINDOW) {
    record.count = 0;
    record.first = now;
  }
  
  return { blocked: false, attempts: record.count };
}

// 실패 기록
function recordFailure(ip) {
  const now = Date.now();
  const record = attempts.get(ip) || { count: 0, first: now };
  
  if (now - record.first > CONFIG.ATTEMPT_WINDOW) {
    record.count = 1;
    record.first = now;
  } else {
    record.count++;
  }
  
  attempts.set(ip, record);
  
  // 최대 시도 초과시 차단
  if (record.count >= CONFIG.MAX_ATTEMPTS) {
    blocked.set(ip, now + CONFIG.LOCK_TIME);
    attempts.delete(ip);
    return true;
  }
  return false;
}

// 성공시 기록 초기화
function clearAttempts(ip) {
  attempts.delete(ip);
  blocked.delete(ip);
}

export async function onRequest(context) {
  const { request, env } = context;
  const ip = getClientIP(request);
  
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  // POST만 허용
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Rate limit 체크
  const rateCheck = checkRateLimit(ip);
  if (rateCheck.blocked) {
    await randomDelay();
    return new Response(JSON.stringify({ 
      ok: false, 
      error: `Too many attempts. Try again in ${rateCheck.remaining}s`,
      locked: true,
      remaining: rateCheck.remaining,
    }), { 
      status: 429,
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': String(rateCheck.remaining),
      },
    });
  }
  
  // Body 파싱
  let body;
  try {
    body = await request.json();
  } catch {
    await randomDelay();
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const { password } = body;
  
  // 기본 검증
  if (!password || typeof password !== 'string') {
    await randomDelay();
    return new Response(JSON.stringify({ ok: false, error: 'Password required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // 길이 체크 (DoS 방지)
  if (password.length < CONFIG.MIN_PW_LENGTH || password.length > 128) {
    await randomDelay();
    recordFailure(ip);
    return new Response(JSON.stringify({ ok: false, error: 'Invalid credentials' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // 해시 비교
  const inputHash = await sha256(password);
  const storedHash = env.ADMIN_PASSWORD_HASH || '';
  
  // 상수 시간 비교 (타이밍 공격 방지)
  const isValid = secureCompare(inputHash, storedHash);
  
  await randomDelay();
  
  if (isValid) {
    clearAttempts(ip);
    
    // 보안 토큰 생성
    const tokenBuffer = new Uint8Array(32);
    crypto.getRandomValues(tokenBuffer);
    const token = Array.from(tokenBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 토큰 만료시간 (1시간)
    const expiresAt = Date.now() + (60 * 60 * 1000);
    
    return new Response(JSON.stringify({ 
      ok: true, 
      token,
      expiresAt,
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
  
  // 실패 처리
  const wasBlocked = recordFailure(ip);
  const record = attempts.get(ip);
  const attemptsLeft = CONFIG.MAX_ATTEMPTS - (record?.count || 0);
  
  return new Response(JSON.stringify({ 
    ok: false, 
    error: 'Invalid credentials',
    attemptsLeft: wasBlocked ? 0 : attemptsLeft,
    locked: wasBlocked,
    lockTime: wasBlocked ? CONFIG.LOCK_TIME / 1000 : undefined,
  }), {
    status: 401,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
