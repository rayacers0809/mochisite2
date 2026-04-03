import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { password } = req.body;
  if (!password) return res.status(400).json({ ok: false });

  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const stored = process.env.ADMIN_PASSWORD_HASH || '';

  let match = false;
  try {
    match = crypto.timingSafeEqual(
      Buffer.from(inputHash, 'hex'),
      Buffer.from(stored, 'hex')
    );
  } catch { match = false; }

  if (match) {
    const token = crypto.randomBytes(32).toString('hex');
    return res.status(200).json({ ok: true, token });
  }
  return res.status(401).json({ ok: false });
}
