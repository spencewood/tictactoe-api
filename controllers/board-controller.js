var BoardModel = require('../models/board-model');
var Events = require('../events');
var Promise = require('mongoose').Promise;
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
            Events.emit('board:join', model, boardId, playerId);
            if(model.players.length === 2){
                Events.emit('board:ready', model, boardId);
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
            Events.emit('board:leave', model, boardId, playerId);

            return model;
        });
    },

    play: function(boardId, playerId, spot){
        return this.findById(boardId).then(function(board){
            var promise = new Promise();

            ttt.ensureCorrectPlayer(board.players, playerId);
            ttt.ensureCorrectTurn(board.players, playerId, board.turn);

            board.play(spot, ttt.getSpotValue(board.turn))
                .save(promise.resolve.bind(promise));

            return promise;
        }).then(function(model){
            Events.emit('board:play', model, boardId, playerId, spot);
            if(model.isComplete){
                Events.emit('board:complete', model, boardId);
            }
            else{
                Events.emit('board:turn', model, boardId, ttt.getOtherPlayer(model.players, playerId));
            }

            return model;
        });
    }
};

module.exports = BoardController;