// Minimax implementation for Tic-Tac-Toe
const cloneBoard = (board) => board.map(r => [...r]);

const availableMoves = (board) => {
  const moves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "" || board[i][j] === undefined || board[i][j] === null) moves.push([i, j]);
    }
  }
  return moves;
};

const checkWinnerSimple = (board) => {
  const lines = [
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
  ];
  for (const line of lines) {
    const [a,b,c] = line;
    const v1 = board[a[0]][a[1]];
    const v2 = board[b[0]][b[1]];
    const v3 = board[c[0]][c[1]];
    if (v1 !== "" && v1 !== undefined && v1 === v2 && v2 === v3) return v1;
  }
  return null;
}

const isBoardFull = (board) => {
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) if (board[i][j] === "" || board[i][j] === undefined) return false;
  return true;
}

// Alpha-beta minimax. Returns { score, move }
const minimax = (board, depth, isMaximizing, aiPlayer, humanPlayer, alpha, beta) => {
  const winner = checkWinnerSimple(board);
  if (winner === aiPlayer) return { score: 10 - depth };
  if (winner === humanPlayer) return { score: depth - 10 };
  if (isBoardFull(board)) return { score: 0 };

  const moves = availableMoves(board);
  let bestMove = null;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const [r,c] of moves) {
      const b = cloneBoard(board);
      b[r][c] = aiPlayer;
      const res = minimax(b, depth+1, false, aiPlayer, humanPlayer, alpha, beta);
      if (res.score > maxEval) { maxEval = res.score; bestMove = [r,c]; }
      alpha = Math.max(alpha, res.score);
      if (beta <= alpha) break; // beta cut-off
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const [r,c] of moves) {
      const b = cloneBoard(board);
      b[r][c] = humanPlayer;
      const res = minimax(b, depth+1, true, aiPlayer, humanPlayer, alpha, beta);
      if (res.score < minEval) { minEval = res.score; bestMove = [r,c]; }
      beta = Math.min(beta, res.score);
      if (beta <= alpha) break; // alpha cut-off
    }
    return { score: minEval, move: bestMove };
  }
}

const bestMove = (board, aiPlayer='O', humanPlayer='X') => {
  // If board is entirely empty, choose center for best play
  const empties = availableMoves(board);
  if (empties.length === 9) return [1,1];
  const result = minimax(board, 0, true, aiPlayer, humanPlayer, -Infinity, Infinity);
  return result.move || null;
}

export { bestMove, checkWinnerSimple, isBoardFull };
