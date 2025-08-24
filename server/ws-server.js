// Simple WebSocket server for multiplayer rooms
// Run with: node server/ws-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });

// rooms: { roomId: Set of ws }
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      const { type, roomId, payload } = data;
      // If join includes token, verify it
      if (type === 'join' && payload?.token) {
        try {
          // call local verify endpoint
          const fetch = require('node-fetch')
          const verifyUrl = process.env.AUTH_VERIFY_URL
          const resp = await fetch(verifyUrl, { headers: { Authorization: `Bearer ${payload.token}`} })
          if (resp.status !== 200) {
            ws.send(JSON.stringify({ type: 'error', payload: 'unauthorized' }))
            ws.close()
            return
          }
        } catch (e) {
          ws.send(JSON.stringify({ type: 'error', payload: 'auth-failed' }))
          ws.close()
          return
        }
      }
  if (type === 'join') {
        // payload should include user info: { id, name }
        if (!rooms.has(roomId)) rooms.set(roomId, new Set());
        rooms.get(roomId).add(ws);
        ws.roomId = roomId;
  ws.user = payload?.user || { id: null, name: 'Anonymous' };
        // broadcast current user list
        broadcastUserList(roomId);
      } else if (type === 'move' || type === 'state' || type === 'end') {
        // relay to others in room; include sender user
        const msgOut = { type, payload, user: ws.user };
        broadcast(roomId, msgOut);
      } else if (type === 'leave') {
        leaveRoom(ws, roomId);
      }
    } catch (e) {
      console.error('ws parse error', e);
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      leaveRoom(ws, ws.roomId);
    }
  });
});

function broadcast(roomId, msg) {
  const room = rooms.get(roomId);
  if (!room) return;
  const s = JSON.stringify(msg);
  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) client.send(s);
  }
}

function broadcastUserList(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const users = [];
  for (const client of room) {
    users.push(client.user || { id: null, name: 'Anonymous' });
  }
  broadcast(roomId, { type: 'joined', payload: { users } });
}

function leaveRoom(ws, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.delete(ws);
  if (room.size === 0) rooms.delete(roomId);
  else broadcast(roomId, { type: 'left', payload: { count: room.size } });
}

console.log('WebSocket server running on ws://localhost:4000');
