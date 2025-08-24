import React from 'react'

const Box = ({ text, handleClick, disabled=false }) => {
    const baseClasses = 'flex items-center justify-center border-2 text-5xl rounded-lg shadow-sm transition-transform transition-shadow transform';
    const sizeClasses = 'w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36';
    // transparent background by default; occupied cells get a faint fill. subtle hover adds tiny scale and shadow.
    const interactive = text
        ? 'cursor-not-allowed opacity-95 bg-white/10 text-gray-800'
        : 'bg-transparent text-gray-800';

    const disabledClasses = disabled ? 'cursor-not-allowed opacity-60 pointer-events-none' : 'cursor-pointer hover:scale-105 hover:shadow-sm';

    return (
        <div
            onClick={() => { if (!disabled && handleClick) handleClick() }}
            className={`${baseClasses} ${sizeClasses} ${interactive} ${disabledClasses}`}
            role="button"
            aria-label={text ? `Occupied by ${text}` : 'Empty cell'}
        >
            <span className="select-none">{text}</span>
        </div>
    )
}

export default Box