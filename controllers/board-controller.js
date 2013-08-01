var util = require('util');
var EventEmitter = require('events').EventEmitter;
var BoardModel = require('../models/board-model');
var Events = require('../events');
var Promise = require('mongoose').Promise;

var getPlayerNum = function(players, playerId, turn){
    var index = players.indexOf(playerId);
    if(index === -1){
        throw 'Invalid player';
    }
    return turn % 2 === 0 ? 3 : 5;
};

var BoardController = {
    findOne: function(query){
        var promise = new Promise();

        BoardModel.findOne(query, promise.resolve.bind(promise));

        return promise;
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
        });

        return promise;
    },

    addPlayer: function(boardId, playerId){
        var promise = new Promise();

        this.findById(boardId).then(function(b){
            try{
                b.addPlayer(playerId);
            } catch(e){
                promise.reject(e);
            }

            b.save(promise.resolve.bind(promise));
        }, promise.reject.bind(promise));

        promise.then(function(model){
            Events.emit('board:join', model, boardId, playerId);
            if(model.players.length === 2){
                Events.emit('board:ready', model, boardId);
            }
        });

        return promise;
    },

    removePlayer: function(boardId, playerId){
        var promise = new Promise();

        this.findById(boardId).then(function(b){
            try{
                b.removePlayer(playerId);
            } catch(e){
                promise.reject(e);
            }

            b.save(promise.resolve.bind(promise));
        }, promise.reject.bind(promise));

        promise.then(function(model){
            Events.emit('board:leave', model, boardId, playerId);
        });

        return promise;
    },

    play: function(boardId, playerId, spot){
        var promise = new Promise();

        this.findById(boardId).then(function(b){
            try{
                b.play(spot, getPlayerNum(b.players, playerId, b.turn));
            } catch(e){
                promise.reject(e);
            }

            b.save(promise.resolve.bind(promise));
        }, promise.reject.bind(promise));

        promise.then(function(model){
            Events.emit('board:move', model, boardId, playerId, spot);
            if(model.isComplete){
                Events.emit('board:complete', model, boardId);
            }
        });

        return promise;
    }
};

module.exports = BoardController;