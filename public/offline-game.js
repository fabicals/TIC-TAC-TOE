// Keep track of which player's turn it is: "X" or "O"
let currentPlayer = "X";

// To keep the game state (which cells are taken and by whom)
const board = Array(9).fill(null);

// Get input elements for easy access
const p1Input = document.getElementById("player1");
const p2Input = document.getElementById("player2");

// Add event listeners to inputs for Enter key
p1Input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    handleMove(p1Input.value);
  }
});

p2Input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    handleMove(p2Input.value);
  }
});

// Function to handle a player's move input
function handleMove(inputValue) {
  // Convert input to a number and adjust to zero-based index
  const position = parseInt(inputValue, 10) - 1;

  // Validate input
  if (isNaN(position) || position < 0 || position > 8) {
    alert("Please enter a valid number between 1 and 9.");
    clearCurrentInput();
    return;
  }

  if (board[position] !== null) {
    alert("This position is already taken. Try another.");
    clearCurrentInput();
    return;
  }

  // Update the game state
  board[position] = currentPlayer;

  // Update the UI: put "X" or "O" in the corresponding cell
  const cell = document.getElementById(`cell-${position}`);
  cell.textContent = currentPlayer;

  // Clear the current player's input field
  clearCurrentInput();

  // Check if current player won or if it is a draw
  if (checkWin(currentPlayer)) {
    alert(`Player ${currentPlayer} wins! 🎉`);
    resetGame();
    return;
  } else if (board.every(cell => cell !== null)) {
    alert("It's a draw! Try again.");
    resetGame();
    return;
  }

  // Switch turn to the other player
  switchTurn();
}

// Clears the input of the current player
function clearCurrentInput() {
  if (currentPlayer === "X") {
    p1Input.value = "";
  } else {
    p2Input.value = "";
  }
}

// Switch turn and toggle inputs accordingly
function switchTurn() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
    p1Input.disabled = true;
    p2Input.disabled = false;
    p2Input.focus(); // Move cursor to Player 2 input
  } else {
    currentPlayer = "X";
    p2Input.disabled = true;
    p1Input.disabled = false;
    p1Input.focus(); // Move cursor to Player 1 input
  }
}

// Check winning combinations
function checkWin(player) {
  const wins = [
    [0, 1, 2],  // top row
    [3, 4, 5],  // middle row
    [6, 7, 8],  // bottom row
    [0, 3, 6],  // left column
    [1, 4, 7],  // middle column
    [2, 5, 8],  // right column
    [0, 4, 8],  // diagonal
    [2, 4, 6]   // diagonal
  ];

  return wins.some(combination =>
    combination.every(index => board[index] === player)
  );
}

// Reset the game to initial state
function resetGame() {
  // Clear board array
  for (let i = 0; i < board.length; i++) {
    board[i] = null;
    document.getElementById(`cell-${i}`).textContent = "";
  }
  // Reset turn
  currentPlayer = "X";
  p1Input.disabled = false;
  p2Input.disabled = true;
  p1Input.value = "";
  p2Input.value = "";
  p1Input.focus();
}