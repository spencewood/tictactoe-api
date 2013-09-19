var arry = require('../util/arry');
var _ = require('underscore');

var TicTacToe = {
    getComboInfo: function(spots, combos){
        return _.map(combos, function(combo){
            var spotValues = _.map(combo, function(spot){
                return spots[spot];
            });

            return {
                spots: combo,
                product: arry.multiply.apply(null, spotValues),
                open: _.map(arry.allIndexesOf(spotValues, 2), function(valSpot){
                    return combo[valSpot];
                })
            };
        });
    },

    getWinPossibilities: function(spots, combos){
        var possibilities = [];
        _.each(combos, function(combo){
            var product = arry.multiply(_.map(combo, function(spot){
                return spots[spot];
            }));

            if(product === 18 || product === 50){
                possibilities.push(_.indexOf(combo, 2));
            }
        });
        return possibilities;
    },

    getWinPossibility: function(spots, combos){
        return arry.randomValue(this.getWinPossibilities(spots, combos));
    },

    getRandomOpenSpot: function(spots){
        return arry.randomValue(arry.allIndexesOf(spots, 2));
    },

    getOtherPlayer: function(players, playerId){
        return _.reject(players, function(num){
            return num === playerId;
        }).pop();
    },

    getSpotValue: function(turn){
        return turn % 2 === 0 ? 3 : 5;
    },

    ensureCorrectPlayer: function(players, playerId){
        if(players.indexOf(playerId) === -1){
            throw 'Player unable to play';
        }
    },

    ensureCorrectTurn: function(players, playerId, turn){
        if(turn % 2 !== players.indexOf(playerId)){
            throw 'Player playing out of turn';
        }
    }
};

module.exports = TicTacToe;