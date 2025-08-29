import React from 'react'
import GameBoard from '@/components/GameBoard'
import { bestMove } from '@/lib/ai'

const page = () => {
  // AI will play as 'O', human 'X'. bestMove expects board with falsy empties; our GameBoard uses "" so adapt
  return (
    <div className="flex items-center justify-center -ml-20  min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-inter overflow-x-hidden relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-teal-900/20 pointer-events-none"></div>
      <GameBoard mode='ai' storageKey={'xenxo_score_history_ai_v1'} />
    </div>
  )
}

export default page