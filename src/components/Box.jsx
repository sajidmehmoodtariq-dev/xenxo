import React from 'react'

const Box = ({ text, handleClick }) => {
    return (
        <div onClick={handleClick} className='w-32 h-32 flex items-center justify-center border-2 text-5xl'>
            <span>{text}</span>
        </div>
    )
}

export default Box