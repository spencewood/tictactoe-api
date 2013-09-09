var BoardController = require('../controllers/board-controller');
var _ = require('underscore');

var multiply = function(arr){
    return _.reduce(arr, function(memo, num){
        return memo * num;
    });
};

var firstRandomValue = function(arr){
    return _.chain(arr)
        .shuffle()
        .first()
        .value();
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

var winPossible = function(spots){
    var possibilities = [];
    _.each(getWinCombos(), function(combo){
        var product = multiply(_.map(combo, function(spot){
            return spots[spot];
        }));

        if(product === 18 || product === 50){
            possibilities.push(_.indexOf(combo, 2));
        }
    });
    return possibilities;
};

var getWinPossibility = function(spots){
    return firstRandomValue(winPossible(spots));
};

var allIndexesOf = function(spots, item){
    var indexes = [];
    for(var i = 0; i < spots.length; i++){
        if(spots[i] === item){
            indexes.push(i);
        }
    }
    return indexes;
};

var getRandomOpenSpot = function(spots){
    return firstRandomValue(allIndexesOf(spots, 2));
};

var getSpot = function(board){
    var spots = board.getSpots();
    
    if(board.getTurn() > 3){
        var spot = getWinPossibility(spots);
        if(typeof spot !== 'undefined'){
            return spot;
        }
    }
    return getRandomOpenSpot(spots);
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