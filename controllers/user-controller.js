var UserModel = require('../models/user-model');
var Promise = require('mongoose').Promise;
var Events = require('../events');

var UserController = {
    findOne: function(query){
        var promise = new Promise();

        UserModel.findOne(query, promise.resolve.bind(promise));

        return promise;
    },

    findByToken: function(token){
        return this.findOne({ token: token });
    },

    sendLoginEmail: function(email){
        var promise = new Promise();

        UserModel.findOrCreate({ email: email }, promise.resolve.bind(promise));
        promise.then(function(model){
            Events.emit('user:loginEmail', model);
        });

        return promise;
    }
};

module.exports = UserController;