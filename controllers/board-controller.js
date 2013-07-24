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
        return promise;
    },

    find: function(query){
        var promise = new Promise();
        BoardModel.find(query, promise.resolve.bind(promise));
        return promise;
    },

    addPlayer: function(boardId, playerId){
        var promise = new Promise();
        this.find({ _id: boardId }).then(function(b){
            b[0].addPlayer(playerId).save(promise.resolve.bind(promise));
        });
        return promise;
    }
};

module.exports = BoardController;