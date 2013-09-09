var mongoose = require('mongoose');
var schema = require('./schemas/board-schema');
var config = require('../config').database;
var db = mongoose.createConnection(config.url);

schema.path('players').validate(function(value){
    //can't have more than two players
    return value.length <= 2;
}, 'Unable to add more players');

schema.path('players').validate(function(value){
    //can't have duplciate players
    var sorted_arr = value.sort();
    var results = [];
    for (var i = 0; i < value.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results.length === 0;
}, 'Duplicate players');

schema.methods.addPlayer = function(playerId){
    this.players.push(playerId);
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
    else if(this.spots[spot] !== 2){
        throw 'Spot taken';
    }
    else{
        this.spots[spot] = num;
        this.markModified('spots');
        this.turn++;
        this.isComplete = this.spots.indexOf(2) === -1;
    }
    return this;
};

schema.methods.getSpots = function(){
    return this.spots;
};

schema.methods.getTurn = function(){
    return this.turn;
};

schema.methods.isReady = function(){
    return this.players.length === 2;
};

module.exports = db.model('board', schema);