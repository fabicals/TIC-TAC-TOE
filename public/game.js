const socket = io();
let playerSymbol = null;
let board = Array(9).fill(null);
let currentTurn = "X";

socket.on('player-assigned', (symbol) => {
    playerSymbol = symbol;
    alert(`You are Player ${symbol}`);
});

socket.on('room-full', () => {
    alert("Room is full. Only 2 players allowed.")
});

socket.on('move', ({ index, symbol }) => {
    board[index]= symbol;
    document.getElementById(`cell-${index}`).textContent=symbol;
    currentTurn = symbol === "X" ? "O" : "X";
});

document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (board[index] === null && playerSymbol === currentTurn) {
            board[index] = playerSymbol;
            cell.textContent = playerSymbol;
            socket.emit('move', {index, symbol: playerSymbol});
            currentTurn = playerSymbol === "X" ? "O" : "X";
        }
    });
});
