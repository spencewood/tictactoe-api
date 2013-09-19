var BoardModel = require('../models/board-model');
var Events = require('../events');
var Promise = require('mongoose').Promise;
var _ = require('underscore');
var ttt = require('../app/tic-tac-toe');

var BoardController = {
    findOne: function(query){
        return BoardModel.findOne(query).exec();
    },

    findById: function(id){
        return this.findOne({ _id: id });
    },

    all: function(fields){
        fields = fields || [];
        var promise = new Promise();

        BoardModel.find({}, fields.join(' '), promise.resolve.bind(promise));
        
        return promise;
    },

    create: function(){
        var promise = new Promise();

        BoardModel.create({}, promise.resolve.bind(promise));
        promise.then(function(model){
            Events.emit('board:create', model);

            return model;
        });

        return promise;
    },

    addPlayer: function(boardId, playerId){
        return this.findById(boardId).then(function(board){
            var promise = new Promise();
            
            board.addPlayer(playerId)
                .save(promise.resolve.bind(promise));
            
            return promise;
        }).then(function(model){
            Events.emit('board:join', model, playerId);
            if(model.players.length === 2){
                Events.emit('board:ready', model);
            }

            return model;
        });
    },

    removePlayer: function(boardId, playerId){
        return this.findById(boardId).then(function(board){
            var promise = new Promise();

            board.removePlayer(playerId)
                .save(promise.resolve.bind(promise));
            
            return promise;
        }).then(function(model){
            Events.emit('board:leave', model, playerId);

            return model;
        });
    },

    play: function(boardId, playerId, spot){
        //TODO: clean this up
        return this.findById(boardId).then(function(board){
            var promise = new Promise();

            if(board.isComplete){
                throw 'Unable to play on complete board';
            }

            ttt.ensureCorrectPlayer(board.players, playerId);
            ttt.ensureCorrectTurn(board.players, playerId, board.turn);

            board.play(spot, ttt.getSpotValue(board.turn))
                .save(promise.resolve.bind(promise));

            return promise;
        }).then(function(model){
            var promise = new Promise();

            var spots = model.getSpots();
            var info = ttt.getComboInfo(spots, model.getWinCombos());

            var playerOneWon = _.findWhere(info, {product: 27});
            var playerTwoWon = _.findWhere(info, {product: 125});
            var full = spots.indexOf(2) === -1;

            Events.emit('board:play', model, playerId, spot);

            if(playerOneWon){
                Events.emit('board:win', model, model.getPlayerOneId());
                Events.emit('board:complete', model);
                model.setComplete()
                    .setWinner(model.getPlayerOneId())
                    .save(promise.resolve.bind(promise));
            }
            else if(playerTwoWon){
                Events.emit('board:win', model, model.getPlayerTwoId());
                Events.emit('board:complete', model);
                model.setComplete()
                    .setWinner(model.getPlayerTwoId())
                    .save(promise.resolve.bind(promise));
            }
            else if(full){
                Events.emit('board:complete', model);
                model.setComplete()
                    .save(promise.resolve.bind(promise));
            }
            else{
                Events.emit('board:turn', model, ttt.getOtherPlayer(model.players, playerId));
                return model;
            }

            return promise;
        });
    }
};

module.exports = BoardController;