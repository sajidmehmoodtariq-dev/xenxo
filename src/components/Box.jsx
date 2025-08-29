import React from 'react'

const Box = ({ text, handleClick, disabled=false }) => {
    const classes = `flex items-center justify-center border-2 text-5xl rounded-lg transition-transform transform ${disabled ? 'opacity-60 pointer-events-none' : 'hover:scale-105 hover:shadow-sm'}`
    const size = 'w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36'
    const occupied = text ? 'bg-white/8 text-white' : 'bg-transparent text-white/90'

    return (
        <div
            onClick={() => { if (!disabled && handleClick) handleClick() }}
            className={`${classes} ${size} ${occupied}`}
            role="button"
            aria-label={text ? `Occupied by ${text}` : 'Empty cell'}
        >
            <span className="select-none">{text}</span>
        </div>
    )
}

export default Box