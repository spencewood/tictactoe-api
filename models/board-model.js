var mongoose = require('mongoose');
var schema = require('./schemas/board-schema');
var config = require('../config').database;
var db = mongoose.createConnection(config.url);
var arry = require('../util/arry');

schema.path('players').validate(function(value){
    //can't have more than two players
    return value.length <= 2;
}, 'Unable to add more players');

schema.path('players').validate(function(value){
    //can't have duplciate players
    return arry.hasDuplicates(value);
}, 'Duplicate players');

schema.methods.addPlayer = function(playerId){
    this.players.push(playerId);
    return this;
};

schema.methods.removePlayer = function(playerId){
    var index = this.players.indexOf(playerId);
    if(index !== -1){
        this.players.splice(index, 1);
    }
    return this;
};

schema.methods.play = function(spot, num){
    if(this.isReady() && this.spots[spot] === 2){
        this.spots[spot] = num;
        this.markModified('spots');
        this.turn++;
    }
    return this;
};

schema.methods.getSpots = function(){
    return this.spots;
};

schema.methods.getTurn = function(){
    return this.turn;
};

schema.methods.getWinCombos = function(){
    return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];
};

schema.methods.isReady = function(){
    return this.players.length === 2;
};

schema.methods.getPlayerOneId = function(){
    return this.players[0];
};

schema.methods.getPlayerTwoId = function(){
    return this.players[1];
};

schema.methods.setComplete = function(){
    this.isComplete = true;
    return this;
};

module.exports = db.model('board', schema);