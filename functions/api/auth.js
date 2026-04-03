export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await context.request.json();
  const { password } = body;
  if (!password) return new Response(JSON.stringify({ ok: false }), { status: 400 });

  // SHA-256 해시 비교
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const stored = context.env.ADMIN_PASSWORD_HASH || '';

  if (inputHash === stored) {
    const tokenBuffer = new Uint8Array(32);
    crypto.getRandomValues(tokenBuffer);
    const token = Array.from(tokenBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    return new Response(JSON.stringify({ ok: true, token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
