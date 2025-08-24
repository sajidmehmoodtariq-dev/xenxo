import clientPromise from '@/lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db()
  const { id } = req.query
  const rooms = db.collection('rooms')
  const games = db.collection('games')

  if (req.method === 'GET') {
    const room = await rooms.findOne({ roomId: id })
    if (!room) return res.status(404).json({ error: 'not found' })
    return res.status(200).json(room)
  }

  if (req.method === 'POST') {
  const { action, user, move, winner } = req.body || {}
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return res.status(401).json({ error: 'authentication required' })
  const room = await rooms.findOne({ roomId: id })
    if (!room) return res.status(404).json({ error: 'not found' })

    if (action === 'join') {
      // use token identity as canonical user id
  // prefer token.sub (NextAuth user id) as canonical id, fallback to email or name
  const userId = token.sub || token.email || token.name
  const userName = token.name || token.email || 'Player'

      // if already present, return players
      if ((room.players || []).find(p => p.id === userId)) {
        return res.status(200).json({ ok: true, players: room.players })
      }

      // Try to atomically add as X if room empty
      let updated = await rooms.findOneAndUpdate(
        { roomId: id, $expr: { $eq: [{ $size: '$players' }, 0] } },
        { $push: { players: { id: userId, name: userName, symbol: 'X' } } },
        { returnDocument: 'after' }
      )

      if (!updated.value) {
        // if not added, try to atomically add as O if there's exactly one player
        updated = await rooms.findOneAndUpdate(
          { roomId: id, $expr: { $eq: [{ $size: '$players' }, 1] } },
          { $push: { players: { id: userId, name: userName, symbol: 'O' } } },
          { returnDocument: 'after' }
        )
      }

      // fallback: if still not updated, reload room
      let finalRoom = updated.value || await rooms.findOne({ roomId: id })

      // If room already has 2 players but one is a placeholder (guest or dev), try to atomically replace that placeholder with this authenticated user.
      if (!updated.value && finalRoom && (finalRoom.players || []).length >= 2) {
        const placeholders = ['guest', '', null]
        const placeholderEntry = (finalRoom.players || []).find(p => {
          if (!p) return true
          const idLower = (p.id || '').toString().toLowerCase()
          const nameLower = (p.name || '').toString().toLowerCase()
          return placeholders.includes(idLower) || idLower.startsWith('guest') || idLower.startsWith('dev') || nameLower.includes('guest') || nameLower.includes('dev')
        })

        if (placeholderEntry) {
          let claimed = null
          // Prefer matching by id if present
          if (placeholderEntry.id) {
            claimed = await rooms.findOneAndUpdate(
              { roomId: id, 'players.id': placeholderEntry.id },
              { $set: { 'players.$.id': userId, 'players.$.name': userName } },
              { returnDocument: 'after' }
            )
          }

          // If no id or previous update didn't match, try matching by name
          if (!claimed || !claimed.value) {
            claimed = await rooms.findOneAndUpdate(
              { roomId: id, 'players.name': placeholderEntry.name },
              { $set: { 'players.$.id': userId, 'players.$.name': userName } },
              { returnDocument: 'after' }
            )
          }

          if (claimed && claimed.value) finalRoom = claimed.value
        }
      }
      return res.status(200).json({ ok: true, players: finalRoom.players })
    }

    if (action === 'move') {
      // move: { row, col }
      const { row, col } = move || {}
      const userId = token.sub || token.email || token.name
      // find player's assigned symbol by canonical id first
      let playerEntry = (room.players || []).find(p => p.id === userId)

      // if not found, try matching by email or name (legacy entries). If found, claim it atomically.
      if (!playerEntry) {
        const possibleEmail = token.email
        const possibleName = token.name
        // try to find by email or name
        const legacy = (room.players || []).find(p => (p.id && p.id === possibleEmail) || (p.email && p.email === possibleEmail) || (possibleName && p.name === possibleName))
        if (legacy) {
          try {
            const filter = { roomId: id, 'players.name': legacy.name }
            const set = { $set: { 'players.$.id': userId, 'players.$.name': possibleName || legacy.name, 'players.$.email': possibleEmail || legacy.email } }
            const claimed = await rooms.findOneAndUpdate(filter, set, { returnDocument: 'after' })
            if (claimed && claimed.value) {
              playerEntry = (claimed.value.players || []).find(p => p.id === userId) || legacy
            }
          } catch (e) {
            console.error('claim legacy player failed', e)
            playerEntry = legacy
          }
        }
      }

      if (!playerEntry) return res.status(403).json({ error: 'not part of this room' })
      const player = playerEntry.symbol

      // enforce turn
      const current = room.currentTurn || 'X'
      if (player !== current) return res.status(400).json({ error: 'not your turn' })
      // ensure cell empty
      if (room.board[row][col]) return res.status(400).json({ error: 'cell occupied' })
      room.board[row][col] = player
      room.moves = room.moves || []
      room.moves.push({ row, col, player })
      // switch turn
      room.currentTurn = current === 'X' ? 'O' : 'X'
      await rooms.updateOne({ roomId: id }, { $set: { board: room.board, moves: room.moves, currentTurn: room.currentTurn } })
      return res.status(200).json({ ok: true, board: room.board, currentTurn: room.currentTurn })
    }

    if (action === 'end') {
      // allow only participants to end
      const userId = token.email || token.sub || token.name
      if (!room.players.find(p => p.id === userId)) return res.status(403).json({ error: 'not part of this room' })
      // persist game
      const doc = { roomId: id, players: room.players, moves: room.moves || [], winner, createdAt: new Date() }
      await games.insertOne(doc)
      // reset room board
      await rooms.updateOne({ roomId: id }, { $set: { board: [["","",""],["","",""],["","",""]], moves: [], currentTurn: 'X' } })
      return res.status(200).json({ ok: true })
    }

    if (action === 'delete') {
      // only creator can delete
      const userId = token.email || token.sub || token.name
      if (!room.creator || room.creator.id !== userId) return res.status(403).json({ error: 'only creator can delete' })
      await rooms.deleteOne({ roomId: id })
      return res.status(200).json({ ok: true })
    }
  }

  res.status(405).end()
}
