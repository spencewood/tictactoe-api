var Board = require('./board');

/**
 * Tic Tac Toe Master Constructor
 */
var AI = function (board, player) {
    if(!board instanceof Board) {
        throw new TypeError('Must pass along a board to play on');
    }

    if(isNaN(player)) {
        throw new Error('Must pass a player');
    }

    this.board = board;
    this.player = player;
};

/**
 * go
 * Finds the next move
 * @return {Object} this
 */
AI.prototype.go = function () {
    switch(this.board.getTurn()){
        case 8:
        case 6:
        case 7:
        case 5:
        case 4:
        case 3:
        case 2:
        case 1:
        case 0:
            this.board.place(this.player, Board.topLeft);
            break;
        default:
            throw new Error('No more moves!');
    }
    return this;
};

module.exports = AI;