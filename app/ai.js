var BoardController = require('../controllers/board-controller');
var _ = require('underscore');

var sum = function(arr){
    _.reduce(arr, function(memo, num){
        return memo + num;
    }, 0);
};

var getWinCombos = function(){
    return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];
};

var getSpotCombos = function(spots){
    return _.map(getWinCombos(), function(row){
        return _.map(row, function(spot){
            return spots[spot];
        });
    });
};

var checkCombos = function(spots){
    return _.map(getSpotCombos(spots), sum);
};

var winPossible = function(spots){
    return _.find(checkCombos(spots), function(num){
        return num === 18 || num === 50;
    });
};

var getOpenSpotIndexes = function(spots){
    return _.chain(spots).map(function(num, idx){
            if(num === 2){
                return idx;
            }
        })
        .compact()
        .value();
};

var getRandomOpenSpot = function(spots){
    _.chain(getOpenSpotIndexes(spots))
        .shuffle()
        .first()
        .value();
};

var getSpot = function(board){
    var spots = board.getSpots();

    if(board.getTurn() > 3){
        var spot = winPossible(spots);
        if(typeof spot !== 'undefined'){
            return spot;
        }
    }
    
    return getRandomOpenSpot(spots);
};

var AI = {
    play: function(boardId){
        var promise = BoardController.findById(boardId);

        promise.then(function(board){
            return BoardController.play(boardId, 0, getSpot(board));
        }, promise.reject.bind(promise));

        return promise;
    }
};

module.exports = AI;