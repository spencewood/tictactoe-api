var mongoose = require('mongoose');
var schema = require('./schemas/board-schema');
var config = require('../config').database;
var db = mongoose.createConnection(config.url);

schema.methods.addPlayer = function(playerId){
    if(this.isReady()){
        throw 'Unable to add more players';
    }
    else if(this.players.length < 2){
        this.players.push(playerId);
    }
    return this;
};

schema.methods.removePlayer = function(playerId){
    var index = this.players.indexOf(playerId);
    if(index === -1){
        throw 'Player not found';
    }
    else{
        this.players.splice(index, 1);
    }
    return this;
};

schema.methods.isReady = function(){
    return this.players.length === 2;
};

module.exports = db.model('board', schema);