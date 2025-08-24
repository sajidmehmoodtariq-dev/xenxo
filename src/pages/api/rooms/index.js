import clientPromise from '@/lib/mongodb'
import { getToken } from 'next-auth/jwt'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db()
  if (req.method === 'POST') {
    // require authentication to create a room
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return res.status(401).json({ error: 'authentication required' })

    const { name } = req.body || {}
    const roomId = uuidv4().slice(0,8)
    const creatorId = token.email || token.sub || token.name
    const creatorName = token.name || 'Player'
    // creator is auto-added as first player (X)
    const creator = { id: creatorId, name: creatorName, symbol: 'X' }
    const room = { roomId, name: name || `Room ${roomId}`, board: [["","",""],["","",""],["","",""]], players: [creator], moves: [], currentTurn: 'X', creator, createdAt: new Date() }
    await db.collection('rooms').insertOne(room)
    return res.status(201).json(room)
  }
  // list
  const rooms = await db.collection('rooms').find().sort({ createdAt: -1 }).limit(50).toArray()
  res.status(200).json(rooms)
}
