"use client"
import React, { useEffect, useState } from 'react'
import Box from './Box'
import { checkWinner, checkDraw } from '@/lib/game.js'
import { bestMove } from '@/lib/ai'
import Score from './Score'

const GameBoard = ({ mode='local', storageKey='xenxo_score_history_v1' }) => {
  const empty = () => [["","",""],["","",""],["","",""]];
  const [board, setBoard] = useState(empty());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState('');
  const [draw, setDraw] = useState(false);
  const [history, setHistory] = useState(() => {
    try { const raw = localStorage.getItem(storageKey); return raw ? JSON.parse(raw) : []; } catch(e){ return [] }
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch(e){}
  }, [history, storageKey]);

  useEffect(() => {
    // if AI mode and it's AI's turn, compute move with a 2 second delay
    if (mode === 'ai' && !winner && !draw && currentPlayer === 'O') {
      const move = bestMove(board, 'O', 'X');
      if (move) {
        const [r,c] = move;
        // 2 second delay for AI move
        setTimeout(() => handleMove(r,c,true), 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, mode, winner, draw, board]);

  const commitResult = (result) => {
    if (result === 'draw') setHistory(prev => [...prev, { X: 'draw', O: 'draw' }]);
    else if (result === 'X') setHistory(prev => [...prev, { X: 'win', O: 'lose' }]);
    else if (result === 'O') setHistory(prev => [...prev, { X: 'lose', O: 'win' }]);
  }

  const handleMove = (row, col, fromAI=false) => {
    if (board[row][col] || winner || draw) return;
    // if multiplayer mode or local, only allow human X to click when appropriate
    if (mode === 'ai' && !fromAI && currentPlayer === 'O') return; // block clicking during AI turn

    const nb = board.map(r => [...r]);
    nb[row][col] = currentPlayer;
    setBoard(nb);

    const w = checkWinner(nb);
    if (w) { setWinner(w); commitResult(w); return; }
    const d = checkDraw(nb);
    if (d) { setDraw(true); commitResult('draw'); return; }

    setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
  }

  const reset = () => {
    setBoard(empty());
    setWinner('');
    setDraw(false);
    // randomize who starts after each game
    const starter = Math.random() < 0.5 ? 'X' : 'O';
    setCurrentPlayer(starter);
  }

  return (
    <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
      <div className='flex flex-col items-center gap-4'>
        <div className='text-center w-full'>
          {winner ? <div className='text-2xl font-bold'>Player {winner} Wins!</div>
            : draw ? <div className='text-2xl font-bold'>It's a Draw!</div>
            : <div className='text-lg'>Current: <strong>{currentPlayer}</strong></div>}
        </div>

        <div className='p-4 rounded-md bg-transparent'>
          <div className='grid grid-rows-3 gap-3'>
            {board.map((rowArr, r) => (
              <div key={r} className='grid grid-cols-3 gap-3'>
                {rowArr.map((cell, c) => (
                  <Box key={c} text={cell} handleClick={() => handleMove(r,c,false)} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-3'>
          {(winner || draw) && <button onClick={reset} className='px-4 py-2 rounded bg-indigo-600 text-white'>Play Again</button>}
          <button onClick={() => { setHistory([]); try{ localStorage.removeItem(storageKey) }catch(e){} }} className='px-4 py-2 rounded border'>Clear History</button>
        </div>
      </div>

      <div className='w-full md:w-80'>
        <Score history={history} mode={mode} />
      </div>
    </div>
  )
}

export default GameBoard
