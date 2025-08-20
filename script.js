const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const twoPlayersBtn = document.getElementById('two-players-btn');
const vsRobotBtn = document.getElementById('vs-robot-btn');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = "two-players"; // Default mode

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Vez do jogador ${currentPlayer}`;
};

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Jogador ${currentPlayer} venceu! Parabéns!`;
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.textContent = "Empate!";
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if (gameMode === "vs-robot" && currentPlayer === "O" && gameActive) {
        setTimeout(handleRobotMove, 500);
    }
};

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

const handleRobotMove = () => {
    let availableCells = [];
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            availableCells.push(i);
        }
    }

    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const robotMoveIndex = availableCells[randomIndex];
        const robotCell = cells[robotMoveIndex];
        
        handleCellPlayed(robotCell, robotMoveIndex);
        handleResultValidation();
    }
};

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.textContent = `Vez do jogador X`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
};

const handleTwoPlayersMode = () => {
    gameMode = "two-players";
    handleRestartGame();
};

const handleVsRobotMode = () => {
    gameMode = "vs-robot";
    handleRestartGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);
twoPlayersBtn.addEventListener('click', handleTwoPlayersMode);
vsRobotBtn.addEventListener('click', handleVsRobotMode);