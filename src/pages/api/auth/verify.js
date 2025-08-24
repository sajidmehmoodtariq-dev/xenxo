import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  // verify token string in Authorization header
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'no token' })
  const token = auth.split(' ')[1]
  try {
    const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: false })
    if (!t) return res.status(401).json({ error: 'invalid' })
    res.status(200).json({ ok: true, token: t })
  } catch (e) {
    res.status(401).json({ error: 'invalid' })
  }
}
