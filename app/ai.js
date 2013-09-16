var BoardController = require('../controllers/board-controller');
var ttt = require('./tic-tac-toe');

var getSpot = function(board){
    var spots = board.getSpots();
    
    if(board.getTurn() > 3){
        var spot = ttt.getWinPossibility(spots, board.getWinCombos());
        if(typeof spot !== 'undefined'){
            return spot;
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