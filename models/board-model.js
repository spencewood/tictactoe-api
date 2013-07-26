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

schema.methods.play = function(spot, num){
    if(!this.isReady()){
        throw 'Board not ready';
    }
    else if(this.getSpots()[spot] !== 2){
        throw 'Spot taken';
    }
    else{
        this.getSpots()[spot] = num;
        this.markModified('spots');
    }
    return this;
};

schema.methods.getSpots = function(){
    return this.spots;
};

schema.methods.isReady = function(){
    return this.players.length === 2;
};

module.exports = db.model('board', schema);