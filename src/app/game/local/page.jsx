"use client"
import Box from '@/components/Box';
import React, { useState } from 'react'
import { checkWinner, checkDraw } from '@/lib/game.js';

const page = () => {
  const [board, setboard] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);
  const [currentPlayer, setcurrentPlayer] = useState("X");
  const [winner, setwinner] = useState("");
  const [draw, setdraw] = useState(false);

  const handleClick = (row, col) => {
  // Ignore clicks on occupied cells or after game end
  if (board[row][col] !== "" || winner || draw) return;

  // create a deep copy of the board rows to avoid mutating state
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = currentPlayer;
  setboard(newBoard);

  // use the updated board when checking for a winner or draw
  const winnerPlayer = checkWinner(newBoard);
  if (winnerPlayer) { setwinner(winnerPlayer); return }
  const isDraw = checkDraw(newBoard);
  setdraw(isDraw);
  setcurrentPlayer(currentPlayer === "O" ? "X" : "O")
  }

  const handleReset = () => {
    const newBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
    setboard(newBoard);
    setwinner("");
    setcurrentPlayer("X");
  setdraw(false)
  }
  
  return (
    <div className='flex flex-col items-center justify-center w-screen gap-8'>
      {/* Game Status */}
      {winner && (
        <div className='text-center'>
          <span className='text-5xl'>Player {winner} Wins!</span>
        </div>
      )}

      {draw && !winner && (
        <div className='text-center'>
          <span className='text-5xl'>It's a Draw!</span>
        </div>
      )}

      {!winner && !draw && (
        <div className='text-center'>
          <span className='text-2xl'>Current Player: {currentPlayer}</span>
        </div>
      )}

      {/* Game Board - Always show */}
      <div>
        {board.map((boxes, row) => (
          <div key={row} className='flex'>
            {boxes.map((box, col) => (
              <Box key={col} text={box} handleClick={() => handleClick(row, col)} />
            ))}
          </div>
        ))}
      </div>

      {/* Reset Button - Show when game is over */}
      {(winner || draw) && (
        <button
          className='w-32 h-10 border rounded-full text-white hover:bg-gray-800'
          onClick={handleReset}
        >
          Play Again
        </button>
      )}
    </div>
  )
}

export default page