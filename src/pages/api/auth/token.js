import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  // returns raw NextAuth JWT for the current session (browser cookies required)
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    if (!token) return res.status(401).json({ error: 'No session' })
    res.status(200).json({ token })
  } catch (e) {
    res.status(500).json({ error: 'token error' })
  }
}
