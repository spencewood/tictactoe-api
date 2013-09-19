var BoardController = require('../controllers/board-controller');
var _ = require('underscore');
var ttt = require('./tic-tac-toe');

var getSpot = function(board){
    var spots = board.getSpots();
    var turn = board.getTurn();

    if(turn > 3){
        var info = ttt.getComboInfo(spots, board.getWinCombos());

        var playerOneCanWin = _.findWhere(info, {product: 18});
        var playerTwoCanWin = _.findWhere(info, {product: 50});

        if(playerOneCanWin){
            return _.first(playerOneCanWin.open);
        }
        if(playerTwoCanWin){
            return _.first(playerTwoCanWin.open);
        }
    }
    return ttt.getRandomOpenSpot(spots);
};

var AI = {
    play: function(boardId){
        return BoardController.findById(boardId).then(function(board){
            var spot = getSpot(board);
            return BoardController.play(boardId, 0, spot);
        });
    }
};

module.exports = AI;