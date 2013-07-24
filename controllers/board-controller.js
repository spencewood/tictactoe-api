var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
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
            b.addPlayer(playerId).save(promise.resolve.bind(promise));
        }, promise.reject.bind(promise));
        promise.then(function(model){
            Events.emit('board:join', boardId, playerId);
        });

        return promise;
    }
};

module.exports = BoardController;