import React from 'react'

export default function Score({ history = [], mode = 'local' }) {
    // Always display exactly 5 rows (most recent first). Fill empty rows with placeholders
    const rowsToShow = 5;
    const padded = [...history].slice(-rowsToShow).reverse(); // latest first
    while (padded.length < rowsToShow) padded.push({ X: '', O: '' });

    // compute totals
    let totals = { X: 0, O: 0, draws: 0 };
    history.forEach(h => {
        if (h.X === 'win') totals.X++;
        if (h.O === 'win') totals.O++;
        if (h.X === 'draw' && h.O === 'draw') totals.draws++;
    });

    return (
    <div className="w-full md:w-96 lg:w-112 mx-auto bg-transparent p-6 rounded-xl shadow-none">
            <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-semibold">Score History</div>
                <div className="text-sm text-gray-500">Last {rowsToShow}</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                    <div className="grid grid-cols-3 gap-2 text-sm font-medium text-center mb-2">
                        <div className="text-left">Game</div>
                        <div>{mode === 'ai' ? 'Player' : 'X'}</div>
                        <div>{mode === 'ai' ? 'AI' : 'O'}</div>
                    </div>

                    <div className="space-y-2">
                        {padded.map((game, index) => (
                            <div key={index} className="grid grid-cols-3 items-center gap-2 py-2 px-3 rounded-md bg-transparent hover:bg-white/5 hover:shadow-sm transition"> 
                                <div className="text-left text-xs text-gray-600">{history.length - index > 0 ? `#${history.length - index}` : 'Empty'}</div>
                                <div className="font-semibold text-center">{game.X || '-'}</div>
                                <div className="font-semibold text-center">{game.O || '-'}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-44 flex flex-col items-center justify-center gap-3">
                    <div className="text-sm text-gray-600">Totals</div>
                    <div className="flex flex-col gap-2 mt-1 w-full">
                        <div className="flex items-center justify-between px-3 py-2 bg-indigo-600 text-white rounded"> <span>X</span> <strong>{totals.X}</strong> </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-rose-600 text-white rounded"> <span>O</span> <strong>{totals.O}</strong> </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-700 text-white rounded"> <span>Draws</span> <strong>{totals.draws}</strong> </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
