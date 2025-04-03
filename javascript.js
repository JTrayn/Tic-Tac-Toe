
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
    function isDraw() {
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
        isDraw,
        boardPositions
    }
})();


let gameController = (function(gameboard){

    let player1;
    let player2;

    function setPlayers(playerOne, playerTwo) {
        player1 = playerOne;
        player2 = playerTwo;
        _initializePlayers();
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
            console.warn(`The winner is ${winner.name}!!!`);
            winner.incrementScore();
        } else if(gameboard.isDraw()) {
            console.warn(`The game is a draw!`);
        }
    }
    function resetGame() {
        gameboard.resetBoard();
        _initializePlayers();
    }
    function resetScores() {
        player1.resetScore();
        player2.resetScore();
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
        if(gameboard.isWinner() || gameboard.isDraw()) {
            resetGame();
        }
        if(gameboard.isPositionEmpty(boardPosition)) {
            let player = player1.isTurn ? player1 : player2;
            gameboard.insertOnBoard(player, boardPosition);
            printGameStateToConsole();
            _evalulateGame();
            player1.isTurn = !player1.isTurn;
            player2.isTurn = !player2.isTurn;
        } else {
            console.warn("Position is not empty. No action taken");
        }
    }
    return {
        setPlayers,
        playTurn,
        resetGame,
        resetScores,
        displayScores,
        printGameStateToConsole
    }
    
})(gameboard);







gameController.setPlayers(new Player("Jayden"), new Player("Steph"));

gameController.playTurn(gameboard.boardPositions.topLeft);
gameController.playTurn(gameboard.boardPositions.middle);
gameController.playTurn(gameboard.boardPositions.bottomRight);
gameController.playTurn(gameboard.boardPositions.bottomMiddle);
gameController.playTurn(gameboard.boardPositions.topMiddle);
gameController.playTurn(gameboard.boardPositions.topRight);
gameController.playTurn(gameboard.boardPositions.bottomLeft);
gameController.playTurn(gameboard.boardPositions.middleRight);
gameController.playTurn(gameboard.boardPositions.middleLeft);








