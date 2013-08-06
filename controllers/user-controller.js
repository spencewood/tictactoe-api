var UserModel = require('../models/user-model');
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