
/*************** PLAYER DATA ****************/
class Player {
    #name;
    #role;
    #score;
    #isTurn;
    constructor(name) {
        this.#name = name;
        this.#score = 0;
    }
    get name() {
        return this.#name;
    }
    get role() {
        return this.#role;
    }
    get score() {
        return this.#score;
    }
    get isTurn() {
        return this.#isTurn;
    }
    set name(name) {
        this.#name = name;
    }
    set role(role) {
        this.#role = role;
    }
    set isTurn(isTurn) {
        this.#isTurn = isTurn;
    }
    resetScore() {
        this.#score = 0;
    }
    incrementScore() {
        this.#score++;
    }
}

/*************** GAME BOARD ****************/
let gameboard = (function() {
    let board;
    let lastInsertion = null;
    const boardPositions = {
        topLeft:        [0, 0],
        topMiddle:      [0, 1],
        topRight:       [0, 2],
        middleLeft:     [1, 0],
        middle:         [1, 1],
        middleRight:    [1, 2],
        bottomLeft:     [2, 0],
        bottomMiddle:   [2, 1],
        bottomRight:    [2, 2]
    }
    resetBoard();

    function insertOnBoard(player, boardPosition) {
            board[boardPosition[0]][boardPosition[1]] = player.role;
            lastInsertion = player.role;
    }
    function getLastInsertion() {
        return lastInsertion;
    }
    function resetBoard() {
        board = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
        lastInsertion = null;
    }
    function isPositionEmpty(boardPosition) {
        return board[boardPosition[0]][boardPosition[1]] === " " ? true : false;
    }
    function isWinner() {
        return  (!isEmpty() &&
                (board[0].every(element => element === board[0][0]) && board[0][0] !== ' ') ||
                (board[1].every(element => element === board[1][0]) && board[1][0] !== ' ') ||
                (board[2].every(element => element === board[2][0]) && board[2][0] !== ' ') || 
                (board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[0][0] !== ' ') ||
                (board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[0][1] !== ' ') ||
                (board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[0][2] !== ' ') ||
                (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ' ') ||
                (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[2][0] !== ' '));
    }
    function isBoardFull() {
        return (!board[0].includes(' ') && !board[1].includes(' ') && !board[2].includes(' '));
    }
    function isEmpty() {
        return lastInsertion === null;
    }
    function getBoard() {
        return board;
    }
    return {
        insertOnBoard,
        resetBoard,
        getBoard,
        getLastInsertion,
        isPositionEmpty,
        isEmpty,
        isWinner,
        isBoardFull,
        boardPositions
    }
})();

/*************** DISPLAY MODULE ****************/
let displayModule = (function(gameboard) {

    let player1;
    let player2;

    // Cache DOM
    let playerOneContainer = document.querySelector('.player1-container');
    let playerTwoContainer = document.querySelector('.player2-container');
    let playerOneName = document.querySelector('.player1-name');
    let playerTwoName = document.querySelector('.player2-name');
    let playerOneRole = document.querySelector('.player1-container .role');
    let playerTwoRole = document.querySelector('.player2-container .role');
    let playerOneScore = document.querySelector('.player1-container .score');
    let playerTwoScore = document.querySelector('.player2-container .score');
    let resetScoresButton = document.querySelector('.reset-scores-button');
    let newGameButton = document.querySelector('.new-game-button');
    let cells = document.querySelectorAll('.cell');

    function initialize(playerOne, playerTwo) {
        player1 = playerOne;
        player2 = playerTwo;
        render();
    }
    function bindEvents(newGame, resetScores, playTurn) {
        // Buttons
        resetScoresButton.addEventListener("click", resetScores);
        newGameButton.addEventListener("click", newGame);
        // Cell clicking functionality
        cells.forEach(cell => {
            cell.addEventListener("click", e => {
                if(gameboard.isBoardFull() || gameboard.isWinner()) {
                    console.warn("Game is over. Please start a New Game");
                    return;
                }
                if (gameboard.isPositionEmpty(gameboard.boardPositions[e.target.getAttribute('name')])) {
                    player1.isTurn ? cell.style.color = "#9F9FFF" :
                                     cell.style.color = "#FFA0A0";
                } 
                playTurn(gameboard.boardPositions[e.target.getAttribute('name')]); 
            });
        });
    }
    function render() {
        // Player data
        _refreshPlayerData();
        // Display
        _refreshCells();
    }
    function _refreshCells() {
        for(key in gameboard.boardPositions) {
            let cell = document.querySelector(`.cell[name="${key}"]`);
            cell.textContent = gameboard.getBoard()
                [gameboard.boardPositions[key][0]]
                [gameboard.boardPositions[key][1]];
        }
    }
    function _refreshPlayerData() {
        playerOneName.textContent = player1.name;
        playerTwoName.textContent = player2.name;
        playerOneRole.textContent = `Role: ${player1.role}`;
        playerTwoRole.textContent = `Role: ${player2.role}`;
        playerOneScore.textContent = `Score: ${player1.score}`;
        playerTwoScore.textContent = `Score: ${player2.score}`;
        if(player1.isTurn) {
            playerOneContainer.classList.add('current-player-highlight');
            playerTwoContainer.classList.remove('current-player-highlight');
        }else {
            playerOneContainer.classList.remove('current-player-highlight');
            playerTwoContainer.classList.add('current-player-highlight');
        }
    }   
    return {
        initialize,
        render,
        bindEvents,
    }

})(gameboard);

/*************** GAME CONTROLLER ****************/
let gameController = (function(gameboard, displayModule){

    let player1;
    let player2;

    function setPlayers(playerOne, playerTwo) {
        player1 = playerOne;
        player2 = playerTwo;
        _initializePlayers();
        displayModule.initialize(player1, player2);
        displayModule.bindEvents(resetGame, resetScores, playTurn);
    }
    function _initializePlayers() {
        // Randomly choose role
        player1.role = Math.random() >= 0.5 ? "x" : "o";
        player2.role = player1.role === "x" ? "o" : "x";
        // Randomly choose turn
        player1.isTurn = Math.random() >= 0.5 ? true : false;
        player2.isTurn = !player1.isTurn;
    }
    function _evalulateGame() {
        if(gameboard.isWinner()) {
            let winner = player1.isTurn ? player1 : player2;
            setTimeout(() => alert(`The winner is ${winner.name}!!!`), 0);
            winner.incrementScore();
        } else if(gameboard.isBoardFull()) {
            setTimeout(() => alert(`The game is a draw!`), 0);
        }
    }
    function resetGame() {
        gameboard.resetBoard();
        _initializePlayers();
        displayModule.render();
    }
    function resetScores() {
        player1.resetScore();
        player2.resetScore();
        displayModule.render();
    }
    function displayScores() {
        console.log(`${player1.name}: ${player1.score}`);
        console.log(`${player2.name}: ${player2.score}`);
    }
    function printGameStateToConsole() {
        console.log(`${player1.name} (${player1.role}) | ${player2.name} (${player2.role})`);
        console.log(gameboard.getBoard()[0].join("  "));
        console.log(gameboard.getBoard()[1].join("  "));
        console.log(gameboard.getBoard()[2].join("  "));
    }
    function playTurn(boardPosition) {
        if(gameboard.isPositionEmpty(boardPosition)) {
            let player = player1.isTurn ? player1 : player2;
            gameboard.insertOnBoard(player, boardPosition);
            _evalulateGame();
            if(!gameboard.isWinner()) {
                player1.isTurn = !player1.isTurn;
                player2.isTurn = !player2.isTurn;
            }
        } else {
            console.warn("Position is not empty. No action taken");
        }
        displayModule.render();
    }
    return {
        setPlayers,
        playTurn,
        resetGame,
        resetScores,
        displayScores,
        printGameStateToConsole
    }
    
})(gameboard, displayModule);




gameController.setPlayers(new Player("Jayden"), new Player("Steph"));











