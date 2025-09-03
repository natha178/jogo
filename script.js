<script> 
        // Seleciona todos os elementos HTML necessários para o jogo
        const cells = document.querySelectorAll('.cell');
        const statusDisplay = document.getElementById('status');
        const restartBtn = document.getElementById('restart-btn');
        const twoPlayersBtn = document.getElementById('two-players-btn');
        const vsRobotBtn = document.getElementById('vs-robot-btn');

        // Variáveis de estado do jogo
        let gameActive = true; // Indica se o jogo está em andamento
        let currentPlayer = "X"; // O jogador atual
        let gameState = ["", "", "", "", "", "", "", "", ""]; // Representa o tabuleiro
        let gameMode = "two-players"; // Modo de jogo inicial

        // Condições de vitória (todas as combinações possíveis)
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

        // Função para alternar o jogador
        const handlePlayerChange = () => {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusDisplay.textContent = `Vez do jogador ${currentPlayer}`;
        };

        // Função para marcar uma célula com a jogada do jogador atual
        const handleCellPlayed = (clickedCell, clickedCellIndex) => {
            gameState[clickedCellIndex] = currentPlayer;
            clickedCell.textContent = currentPlayer;
            clickedCell.classList.add(currentPlayer.toLowerCase());
        };

        // Função para verificar se há um vencedor ou um empate
        const handleResultValidation = () => {
            let roundWon = false;
            for (let i = 0; i < winningConditions.length; i++) {
                const winCondition = winningConditions[i];
                let a = gameState[winCondition[0]];
                let b = gameState[winCondition[1]];
                let c = gameState[winCondition[2]];
                if (a === "" || b === "" || c === "") {
                    continue; // Pula se alguma célula estiver vazia
                }
                if (a === b && b === c) {
                    roundWon = true; // Vencedor encontrado
                    break;
                }
            }

            if (roundWon) {
                statusDisplay.textContent = `Jogador ${currentPlayer} venceu! Parabéns!`;
                gameActive = false;
                return;
            }

            // Verifica se houve empate (se todas as células estão preenchidas)
            let roundDraw = !gameState.includes("");
            if (roundDraw) {
                statusDisplay.textContent = "Empate!";
                gameActive = false;
                return;
            }

            // Se não houve vitória nem empate, alterna o jogador
            handlePlayerChange();
            // Se o modo for contra o robô e a vez for do O, o robô joga
            if (gameMode === "vs-robot" && currentPlayer === "O" && gameActive) {
                setTimeout(handleRobotMove, 500); // Dá um pequeno atraso para a jogada do robô
            }
        };

        // Função que lida com o clique do mouse em uma célula
        const handleCellClick = (event) => {
            const clickedCell = event.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

            // Verifica se a célula já está preenchida ou se o jogo não está ativo
            if (gameState[clickedCellIndex] !== "" || !gameActive) {
                return;
            }

            handleCellPlayed(clickedCell, clickedCellIndex);
            handleResultValidation();
        };

        // Função para a jogada do robô com uma estratégia mais inteligente
        const handleRobotMove = () => {
            let availableCells = [];
            for (let i = 0; i < gameState.length; i++) {
                if (gameState[i] === "") {
                    availableCells.push(i);
                }
            }

            // 1. Tenta vencer o jogo
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                // Verifica se o robô tem duas marcas em uma linha e a terceira está vazia
                if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") {
                    handleCellPlayed(cells[c], c);
                    handleResultValidation();
                    return;
                }
                if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") {
                    handleCellPlayed(cells[b], b);
                    handleResultValidation();
                    return;
                }
                if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") {
                    handleCellPlayed(cells[a], a);
                    handleResultValidation();
                    return;
                }
            }

            // 2. Tenta bloquear a jogada do jogador
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                // Verifica se o jogador tem duas marcas em uma linha e a terceira está vazia
                if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") {
                    handleCellPlayed(cells[c], c);
                    handleResultValidation();
                    return;
                }
                if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "") {
                    handleCellPlayed(cells[b], b);
                    handleResultValidation();
                    return;
                }
                if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "") {
                    handleCellPlayed(cells[a], a);
                    handleResultValidation();
                    return;
                }
            }
            
            // 3. Tenta pegar o centro
            if (gameState[4] === "") {
                handleCellPlayed(cells[4], 4);
                handleResultValidation();
                return;
            }

            // 4. Tenta pegar um canto
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(index => gameState[index] === "");
            if (availableCorners.length > 0) {
                const cornerMove = availableCorners[Math.floor(Math.random() * availableCorners.length)];
                handleCellPlayed(cells[cornerMove], cornerMove);
                handleResultValidation();
                return;
            }

            // 5. Se não houver jogada estratégica, faz uma jogada aleatória
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                const robotMoveIndex = availableCells[randomIndex];
                const robotCell = cells[robotMoveIndex];
                
                handleCellPlayed(robotCell, robotMoveIndex);
                handleResultValidation();
            }
        };

        // Função para reiniciar o jogo
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

        // Funções para mudar o modo de jogo
        const handleTwoPlayersMode = () => {
            gameMode = "two-players";
            handleRestartGame();
        };

        const handleVsRobotMode = () => {
            gameMode = "vs-robot";
            handleRestartGame();
        };

        // Adiciona os event listeners aos elementos
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        restartBtn.addEventListener('click', handleRestartGame);
        twoPlayersBtn.addEventListener('click', handleTwoPlayersMode);
        vsRobotBtn.addEventListener('click', handleVsRobotMode);
    </script>
</body>
</html>
