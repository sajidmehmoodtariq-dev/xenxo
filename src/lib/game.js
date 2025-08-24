const winnningPattern = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
]

const checkWinner = (board) => {
    for (let i = 0; i < winnningPattern.length; i++) {
        let pattern = winnningPattern[i];
        const pos1 = pattern[0];
        const pos2 = pattern[1];
        const pos3 = pattern[2];
        const value1 = board[pos1[0]][pos1[1]];
        const value2 = board[pos2[0]][pos2[1]];
        const value3 = board[pos3[0]][pos3[1]];
        if (value1 === value2 && value2 === value3 && value1 !== "") {
            return value1; // Return "X" or "O"
        }
    }
}

const checkDraw = (board) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j] === "") return false;
        }
    }
    return true;
}

export { checkWinner, checkDraw }