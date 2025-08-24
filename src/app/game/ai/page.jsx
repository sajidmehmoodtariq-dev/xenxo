import React from 'react'
import GameBoard from '@/components/GameBoard'
import { bestMove } from '@/lib/ai'

const page = () => {
  // AI will play as 'O', human 'X'. bestMove expects board with falsy empties; our GameBoard uses "" so adapt
  return (
    <div className='flex items-center justify-center p-6'>
      <GameBoard mode='ai' storageKey={'xenxo_score_history_ai_v1'} />
    </div>
  )
}

export default page