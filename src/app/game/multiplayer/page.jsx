"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import GameBoard from '@/components/GameBoard'

export default function Page() {
  const { data: session } = useSession()
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState('')
  const [roomName, setRoomName] = useState('')
  const [joined, setJoined] = useState(false)
  const [remoteState, setRemoteState] = useState(null)
  const [mySymbol, setMySymbol] = useState('')

  const userId = session?.user?.id || session?.user?.email || session?.user?.name || 'guest'

  const fetchRooms = async () => {
    const r = await fetch('/api/rooms')
    const j = await r.json()
    setRooms(j)
  }

  useEffect(()=>{ fetchRooms() }, [])

  const createRoom = async () => {
  if (!session) return signIn()
  const res = await fetch('/api/rooms', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ name: roomName || 'Room' }) })
    if (res.status !== 201) return alert('Could not create room')
    const j = await res.json()
    setRoomId(j.roomId)
    // auto-join as creator (server already added creator but refresh client state)
    await joinRoom(j.roomId)
  }

  const joinRoom = async (id) => {
  if (!session) return signIn()
    setRoomId(id)
    // call join API
    const resp = await fetch(`/api/rooms/${id}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ action: 'join' }) })
    if (resp.status !== 200) return alert('Could not join room')
    const j = await resp.json()
    // find our assigned symbol in players list
    const me = (j.players || []).find(p => p.id === userId)
    if (me && me.symbol) {
      setMySymbol(me.symbol)
      setJoined(true)
    } else {
      // if we're not in players array yet, still set joined and wait for polling to pick up.
      setJoined(true)
    }
  }

  // polling for room state
  useEffect(()=>{
    if (!joined || !roomId) return
    let mounted = true
    const tick = async ()=>{
      const r = await fetch(`/api/rooms/${roomId}`)
      if (!mounted) return
      if (r.status === 200) {
        const j = await r.json()
        setRemoteState(j)
        // if server-side assigned us a symbol later, capture it
        const me = (j.players || []).find(p => p.id === userId)
        if (me && me.symbol) setMySymbol(me.symbol)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return ()=>{ mounted=false; clearInterval(id) }
  }, [joined, roomId])

  const sendMove = async (move) => {
    if (!roomId) return
    const resp = await fetch(`/api/rooms/${roomId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ action: 'move', move }) })
    if (!resp.ok) {
      const j = await resp.json().catch(()=>({ error: 'unknown' }))
      console.error('move failed', j)
      alert('Move failed: ' + (j.error || resp.statusText))
    }
  }

  const endGame = async (winner) => {
    if (!roomId) return
  const resp = await fetch(`/api/rooms/${roomId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ action: 'end', winner }) })
  if (!resp.ok) { const j = await resp.json().catch(()=>({ error: 'unknown' })); alert('End failed: ' + (j.error || resp.statusText)); return }
    setJoined(false)
    setRoomId('')
    setMySymbol('')
    fetchRooms()
  }

  const deleteRoom = async () => {
    if (!roomId) return
  const resp = await fetch(`/api/rooms/${roomId}`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ action: 'delete' }) })
  if (!resp.ok) { const j = await resp.json().catch(()=>({ error: 'unknown' })); alert('Delete failed: ' + (j.error || resp.statusText)); return }
    setJoined(false)
    setRoomId('')
    setMySymbol('')
    fetchRooms()
  }

  if (!joined) return (
    <div className='p-6'>
      <h2 className='text-xl mb-4'>Lobby</h2>
      <div className='flex gap-2 items-center'>
        <input value={roomName} onChange={e=>setRoomName(e.target.value)} placeholder='Room name (optional)' className='border px-2 py-1' />
        <button onClick={createRoom} className='px-3 py-2 bg-indigo-600 text-white rounded'>Create Room</button>
      </div>
      <div className='mt-4'>
        {rooms.map(r => (
          <div key={r.roomId} className='flex items-center gap-2 my-2'>
            <div className='flex-1'>{r.name} ({r.roomId})</div>
            <button onClick={()=>joinRoom(r.roomId)} className='px-2 py-1 border'>Join</button>
          </div>
        ))}
      </div>
    </div>
  )

  const disabled = !!(remoteState && mySymbol && remoteState.currentTurn !== mySymbol)

  return (
    <div className='p-6'>
      <h2 className='text-xl mb-4'>Room: {roomId}</h2>
      <div className='mb-2'>You: {session?.user?.name || session?.user?.email} ({mySymbol || '...'})</div>
      <div className='mb-4'>Players: {remoteState?.players?.map(p=>`${p.name}(${p.symbol})`).join(', ') || '...'}</div>
      <div className='mb-4'>Current Turn: {remoteState?.currentTurn || '...'}</div>
      <GameBoard mode='multiplayer' externalBoard={remoteState?.board} externalCurrentTurn={remoteState?.currentTurn} disabled={!mySymbol || disabled} mySymbol={mySymbol} onLocalMove={sendMove} onGameEnd={({result,board})=>endGame(result)} />
  {(remoteState?.creator?.id === userId || remoteState?.creator?.email === session?.user?.email || remoteState?.creator?.name === session?.user?.name) && (
        <div className='mt-4'>
          <button onClick={deleteRoom} className='px-3 py-2 bg-red-600 text-white rounded'>Delete Room</button>
        </div>
      )}
    </div>
  )
}