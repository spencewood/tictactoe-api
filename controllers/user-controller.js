var EventEmitter = require('events').EventEmitter;
var UserModel = require('../models/user-model');
var Events = require('../events');
var Promise = require('mongoose').Promise;

var UserController = {
    findOne: function(query){
        var promise = new Promise();

        UserModel.findOne(query, promise.resolve.bind(promise));

        return promise;
    },

    findByToken: function(token){
        return this.findOne({ token: token });
    },
};

module.exports = UserController;