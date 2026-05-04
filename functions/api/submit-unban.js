/**
 * 모찌서버 - 차단해제 서약서 제출 API
 * 경로: POST /api/submit-unban
 *
 * 환경변수:
 *  - WEBHOOK_UNBAN     : Discord 웹훅 URL (Encrypt 체크)
 *  - ALLOWED_ORIGIN    : 허용 도메인 (예: https://mochi.me.kr)
 *
 * KV Binding:
 *  - RATE_LIMIT        : Rate limit 저장용 KV namespace
 */

const MAX_PDF_SIZE = 50 * 1024 * 1024; // 2MB
const RATE_LIMIT_MAX = 3;              // 시간당 최대 요청 수
const RATE_LIMIT_WINDOW = 60 * 60;     // 1시간 (초)

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 1️⃣ Origin 검증 (같은 도메인이라 Pages에서는 더 엄격하게)
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowed.length && !allowed.includes(origin)) {
    return json({ error: 'Forbidden origin' }, 403);
  }

  // 2️⃣ 환경변수 체크
  if (!env.WEBHOOK_UNBAN) {
    return json({ error: 'Server misconfigured' }, 500);
  }

  // 3️⃣ Rate Limit (KV 있을 때만)
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (env.RATE_LIMIT) {
    const key = `unban:${clientIP}`;
    const current = parseInt((await env.RATE_LIMIT.get(key)) || '0', 10);
    if (current >= RATE_LIMIT_MAX) {
      return json({ error: '요청이 너무 많습니다. 1시간 후 다시 시도해주세요.' }, 429);
    }
    await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW });
  }

  try {
    // 4️⃣ multipart/form-data 파싱
    const form = await request.formData();
    const dataStr = form.get('data');
    const pdf = form.get('pdf');

    if (!dataStr || !pdf) {
      return json({ error: '필수 필드 누락' }, 400);
    }

    let data;
    try {
      data = JSON.parse(dataStr);
    } catch {
      return json({ error: '잘못된 데이터 형식' }, 400);
    }

    // 5️⃣ 입력값 서버 측 재검증
    const v = validateInput(data);
    if (!v.ok) return json({ error: v.error }, 400);

    // 6️⃣ PDF 검증
    if (!(pdf instanceof File) && !(pdf instanceof Blob)) {
      return json({ error: 'PDF 파일이 필요합니다' }, 400);
    }
    if (pdf.size > MAX_PDF_SIZE) {
      return json({ error: 'PDF 파일 크기 초과 (최대 2MB)' }, 400);
    }
    if (pdf.type && pdf.type !== 'application/pdf') {
      return json({ error: 'PDF 파일만 허용됩니다' }, 400);
    }

    // 7️⃣ Discord 웹훅 전송
    const payload = {
      embeds: [{
        title: '🍡 차단해제 서약서 제출',
        color: 0xff8fae,
        fields: [
          { name: '실명',           value: sanitize(data.realname),    inline: true },
          { name: '생년월일',       value: sanitize(data.birthdate),   inline: true },
          { name: '인게임 고유번호', value: sanitize(data.user_id),     inline: true },
          { name: '인게임 닉네임',   value: sanitize(data.ingame_name), inline: true },
          { name: '디스코드',       value: sanitize(data.discord),     inline: true },
          { name: '서약 항목', value: '✅ 6개 항목 전체 동의' },
          { name: '서명',     value: '✍️ 전자 서명 완료 (PDF 첨부)' },
          { name: '제출자 IP', value: `||${clientIP}||`, inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: '모찌서버 차단해제 시스템' }
      }]
    };

    const sendForm = new FormData();
    sendForm.append('payload_json', JSON.stringify(payload));
    sendForm.append('files[0]', pdf, `unban_${data.user_id}_${Date.now()}.pdf`);

    const discordRes = await fetch(env.WEBHOOK_UNBAN, {
      method: 'POST',
      body: sendForm
    });

    if (!discordRes.ok) {
      const errBody = await discordRes.text().catch(() => '');
      console.error('Discord webhook failed:', discordRes.status, errBody);
      return json({ error: '전송 실패' }, 502);
    }

    return json({ ok: true });

  } catch (err) {
    console.error('submit-unban error:', err);
    return json({ error: '서버 오류' }, 500);
  }
}

// ───────── helpers ─────────

function validateInput(d) {
  if (!d || typeof d !== 'object') return { ok: false, error: '잘못된 요청' };
  const checks = [
    ['realname',    /^.{2,20}$/,             '실명 형식 오류'],
    ['birthdate',   /^\d{4}-\d{2}-\d{2}$/,   '생년월일 형식 오류'],
    ['user_id',     /^[0-9A-Za-z_-]{1,20}$/, '고유번호 형식 오류'],
    ['ingame_name', /^.{1,30}$/,             '닉네임 형식 오류'],
    ['discord',     /^.{2,40}$/,             '디스코드 아이디 형식 오류']
  ];
  for (const [key, re, msg] of checks) {
    const val = d[key];
    if (typeof val !== 'string' || !re.test(val)) return { ok: false, error: msg };
  }
  return { ok: true };
}

// Discord 마크다운/멘션 인젝션 방지
function sanitize(s) {
  if (!s) return '-';
  return String(s)
    .slice(0, 100)
    .replace(/@/g, '@\u200b')
    .replace(/`/g, '\\`')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/\|/g, '\\|');
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
