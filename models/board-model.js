var mongoose = require('mongoose');
var schema = require('./schemas/board-schema');
var config = require('../config').database;
var db = mongoose.createConnection(config.url);

schema.methods.addPlayer = function(playerId){
    if(this.players.length < 2){
        this.players.push(playerId);
    }
    return this;
};

module.exports = db.model('board', schema);