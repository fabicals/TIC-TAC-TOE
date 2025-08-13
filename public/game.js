const socket = io();
let playerSymbol = null;
let board = Array(9).fill(null);
let currentTurn = "X";
let gameOver = false;

socket.on('player-assigned', (symbol) => {
    playerSymbol = symbol;
    document.getElementById('player-info').textContent = `You are Player ${symbol}`;
    updateTurnInfo();
});

socket.on('room-full', () => {
    alert("Room is full. Only 2 players allowed.");
});

socket.on('move', ({ index, symbol }) => {
    board[index] = symbol;
    document.getElementById(`cell-${index}`).textContent = symbol;

    if (!gameOver) {
        currentTurn = symbol === "X" ? "O" : "X";
        updateTurnInfo(); }
});


document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (gameOver) return;  

        if (board[index] === null && playerSymbol === currentTurn) {
            board[index] = playerSymbol;
            cell.textContent = playerSymbol;
            socket.emit('move', {index, symbol: playerSymbol});
            if (checkWin()) {
                return;
            }
            currentTurn = playerSymbol === "X" ? "O" : "X";
            updateTurnInfo();
        }
    });
});

socket.on('game-over', ({result, winner}) => {
    gameOver = true; 
    gameEnd();

    const turnDiv = document.getElementById("turn-info");

    if (result === 'win') {
        if (playerSymbol === winner) {
            turnDiv.textContent = 'YOU WIN!';
        } else {
            turnDiv.textContent = `Player ${winner} wins! You lose!`;
        }
    } else if (result === 'draw') {
        turnDiv.textContent = 'It\'s a Draw!';
    }
});

function updateTurnInfo() {
    const turnDiv = document.getElementById("turn-info");
    if (!gameOver) {
        if (playerSymbol === currentTurn) {
          turnDiv.textContent = "YOUR TURN";
        } else {
          turnDiv.textContent = `Waiting for player ${currentTurn}'s Turn`;
        }
    }
}

function checkWin() {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let i = 0; i < wins.length; i++) {
        const [a, b, c] = wins[i];

        if (
            board[a] !== null &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            gameOver = true; 
            socket.emit('game-over', {result:'win', winner: playerSymbol});
            gameEnd();
            return true;
        }
    }

    if (!board.includes(null)) {
        gameOver = true; 
        socket.emit('game-over', {result:'draw'});
        gameEnd();
        return true;
    }


    return false;
}

function gameEnd() {
    if (gameOver) {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.add('disabled');
        });
    }
}
