"use client"
import React, { useEffect, useState } from 'react'
import Box from './Box'
import { checkWinner, checkDraw } from '@/lib/game.js'
import { bestMove } from '@/lib/ai'
import Score from './Score'

const GameBoard = ({ mode='local', storageKey='xenxo_score_history_v1', disabled=false, externalBoard=null, externalCurrentTurn=null, mySymbol='X', onLocalMove=()=>{}, onGameEnd=()=>{} }) => {
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

  // sync external board (multiplayer)
  useEffect(() => {
    if (externalBoard) {
      setBoard(externalBoard);
      const w = checkWinner(externalBoard);
      if (w) { setWinner(w); if (mode !== 'multiplayer') commitResult(w); onGameEnd({ result: w, board: externalBoard }); }
      else if (checkDraw(externalBoard)) { setDraw(true); if (mode !== 'multiplayer') commitResult('draw'); onGameEnd({ result: 'draw', board: externalBoard }); }
      else { setWinner(''); setDraw(false); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalBoard]);

  useEffect(() => {
    // if server provides current turn, reflect it in local view
    if (externalCurrentTurn) setCurrentPlayer(externalCurrentTurn);
  }, [externalCurrentTurn]);

  const commitResult = (result) => {
    // do not store multiplayer results in local history
    if (mode === 'multiplayer') return;
    if (result === 'draw') setHistory(prev => [...prev, { X: 'draw', O: 'draw' }]);
    else if (result === 'X') setHistory(prev => [...prev, { X: 'win', O: 'lose' }]);
    else if (result === 'O') setHistory(prev => [...prev, { X: 'lose', O: 'win' }]);
  }

  const handleMove = (row, col, fromAI=false) => {
    // global guards
    if (winner || draw) return;
    if (disabled) return;
  try { console.debug('GameBoard.handleMove', { mode, row, col, disabled, mySymbol, currentPlayer, externalBoard }); } catch(e){}

    // multiplayer: do not mutate local board, instead send move to server
    if (mode === 'multiplayer' && externalBoard) {
      if (externalBoard[row][col]) return; // occupied
      if (!mySymbol) return;
  try { console.debug('GameBoard -> sending onLocalMove', { row, col, player: mySymbol }) } catch(e){}
  onLocalMove({ row, col, player: mySymbol });
      return;
    }

    // AI mode: prevent human clicking during AI's turn
    if (mode === 'ai' && !fromAI && currentPlayer === 'O') return;

    if (board[row][col]) return;
    const nb = board.map(r => [...r]);
    nb[row][col] = currentPlayer;
    setBoard(nb);

    const w = checkWinner(nb);
    if (w) { setWinner(w); commitResult(w); onGameEnd({ result: w, board: nb }); return; }
    const d = checkDraw(nb);
    if (d) { setDraw(true); commitResult('draw'); onGameEnd({ result: 'draw', board: nb }); return; }

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
            : <div className='text-lg'>Current: <strong>{externalCurrentTurn ?? currentPlayer}</strong></div>}
        </div>

        <div className='p-4 rounded-md bg-transparent'>
          <div className='grid grid-rows-3 gap-3'>
            {board.map((rowArr, r) => (
              <div key={r} className='grid grid-cols-3 gap-3'>
                {rowArr.map((cell, c) => (
                  <Box key={c} text={cell} handleClick={() => handleMove(r,c,false)} disabled={disabled || winner || draw || (mode === 'ai' && currentPlayer === 'O')} />
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
