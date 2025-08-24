import React from 'react'
import GameBoard from '@/components/GameBoard'

const page = () => {
  return (
    <div className='flex items-center justify-center p-6'>
      <GameBoard mode='multiplayer' storageKey={'xenxo_score_history_mp_v1'} />
    </div>
  )
}

export default page