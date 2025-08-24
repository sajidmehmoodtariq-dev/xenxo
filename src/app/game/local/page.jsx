"use client"
import Box from '@/components/Box';
import React, { useEffect, useState } from 'react'
import { checkWinner, checkDraw } from '@/lib/game.js';
import Score from '@/components/Score';

const STORAGE_KEY = 'xenxo_score_history_v1';

const page = () => {
  // 3x3 board state
  const emptyBoard = () => [["", "", ""], ["", "", ""], ["", "", ""]];
  const [board, setboard] = useState(emptyBoard());
  const [currentPlayer, setcurrentPlayer] = useState("X");
  const [winner, setwinner] = useState("");
  const [draw, setdraw] = useState(false);
  const [scoreHistory, setScoreHistory] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // persist scoreHistory
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scoreHistory));
    } catch (e) {
      // ignore storage errors
    }
  }, [scoreHistory]);

  const commitResult = (result) => {
    // result: 'X' | 'O' | 'draw'
    if (result === 'draw') {
      setScoreHistory(prev => [...prev, { X: 'draw', O: 'draw' }]);
    } else if (result === 'X') {
      setScoreHistory(prev => [...prev, { X: 'win', O: 'lose' }]);
    } else if (result === 'O') {
      setScoreHistory(prev => [...prev, { X: 'lose', O: 'win' }]);
    }
  }

  const handleClick = (row, col) => {
    // Ignore clicks on occupied cells or after game end
    if (board[row][col] !== "" || winner || draw) return;

    // create a deep copy of the board rows to avoid mutating state
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setboard(newBoard);

    // check for winner or draw after the move
    const winnerPlayer = checkWinner(newBoard);
    if (winnerPlayer) {
      setwinner(winnerPlayer);
      commitResult(winnerPlayer);
      return;
    }
    const isDraw = checkDraw(newBoard);
    if (isDraw) {
      setdraw(true);
      commitResult('draw');
      return;
    }

    // switch player
    setcurrentPlayer(prev => (prev === "O" ? "X" : "O"));
  }

  const handleReset = () => {
    setboard(emptyBoard());
    setwinner("");
    setcurrentPlayer("X");
    setdraw(false);
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 p-6'>
      <div className='flex flex-col items-center justify-center w-full lg:w-2/3 gap-6'>
        {/* Game Status */}
        <div className='w-full max-w-3xl text-center'>
          {winner && (
            <div className='text-center py-2'>
              <span className='text-4xl font-extrabold'>Player {winner} Wins!</span>
            </div>
          )}

          {draw && !winner && (
            <div className='text-center py-2'>
              <span className='text-4xl font-extrabold'>It's a Draw!</span>
            </div>
          )}

          {!winner && !draw && (
            <div className='text-center py-2'>
              <span className='text-xl'>Current Player: <span className='font-bold'>{currentPlayer}</span></span>
            </div>
          )}
        </div>

        {/* Game Board - Always show */}
        <div className='p-6 rounded-2xl shadow-none bg-transparent'>
          <div className='grid grid-rows-3 gap-3 justify-center'>
            {board.map((boxes, row) => (
              <div key={row} className='grid grid-cols-3 gap-3 justify-center'>
                {boxes.map((box, col) => (
                  <Box key={col} text={box} handleClick={() => handleClick(row, col)} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className='flex gap-4'>
          {(winner || draw) && (
            <button
              className='px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700'
              onClick={handleReset}
            >
              Play Again
            </button>
          )}

          <button
            className='px-6 py-2 border rounded-full text-sm hover:bg-gray-100'
            onClick={() => {
              // clear history and storage
              setScoreHistory([]);
              try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            }}
          >
            Clear History
          </button>
        </div>
      </div>

      <div className='w-full lg:w-1/3'>
        <Score history={scoreHistory} />
      </div>
    </div>
  )
}

export default page