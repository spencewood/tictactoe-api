var util = require('util');
var EventEmitter = require('events').EventEmitter;
var BoardModel = require('../models/board-model');
var Events = require('../events');
var Promise = require('mongoose').Promise;

var BoardController = {
    create: function(){
        var promise = new Promise();

        BoardModel.create({}, promise.resolve.bind(promise));
        promise.then(function(model){
            Events.emit('board:created', model);
        });

        return promise;
    },

    findOne: function(query, callback){
        var promise = new Promise();

        BoardModel.findOne(query, promise.resolve.bind(promise));

        return promise;
    },

    addPlayer: function(boardId, playerId){
        var promise = new Promise();

        this.findOne({ _id: boardId }).then(function(b){
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

        this.findOne({ _id: boardId }).then(function(b){
            try{
                b.removePlayer(playerId);
            } catch(e){
                promise.reject(e);
            }

            b.save(promise.resolve.bind(promise));
        }, promise.reject.bind(promise));

        return promise;
    }
};

module.exports = BoardController;