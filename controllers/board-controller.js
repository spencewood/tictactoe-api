var util = require('util');
var EventEmitter = require('events').EventEmitter;
var BoardModel = require('../models/board-model');
var Events = require('../events');
var Promise = require('mongoose').Promise;

var getPlayerNum = function(players, playerId){
    var index = players.indexOf(playerId);
    if(index === -1){
        throw 'Invalid player';
    }
    return index === 0 ? 3 : 5;
};

var BoardController = {
    create: function(){
        var promise = new Promise();

        BoardModel.create({}, promise.resolve.bind(promise));
        promise.then(function(model){
            Events.emit('board:created', model);
        });

        return promise;
    },

    findOne: function(query){
        var promise = new Promise();

        BoardModel.findOne(query, promise.resolve.bind(promise));

        return promise;
    },

    findById: function(id){
        return this.findOne({ _id: id });
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

        promise.then(function(b){
            Events.emit('board:join', boardId, playerId);
            if(b.players.length === 2){
                Events.emit('board:ready', boardId);
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
            Events.emit('board:leave', boardId, playerId);
        });

        return promise;
    },

    play: function(boardId, playerId, spot){
        var promise = new Promise();
        this.findById(boardId).then(function(b){
            try{
                b.play(spot, getPlayerNum(b.players, playerId));
            } catch(e){
                promise.reject(e);
            }

            b.save(promise.resolve.bind(promise));
        }, promise.reject.bind(promise));

        promise.then(function(model){
            Events.emit('board:move', boardId, playerId, spot);
            if(model.isComplete){
                Events.emit('board:complete', boardId);
            }
        });

        return promise;
    }
};

module.exports = BoardController;