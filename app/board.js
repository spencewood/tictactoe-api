var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var BoardModel = require('../models/board-model');
var Events = require('../events');

/**
 * Tic Tac Toe Board Constructor
 */
var Board = function(){
    this._spots = _.map(_.range(9), function(){
        return 2;
    });
    this._turn = 0;

    BoardModel.create({}, function(err, model){
        this.model = model;
        this.id = model.id;
        this.emit('created', this);
        Events.emit('board:created', this);
    }.bind(this));
};

/**
 * Inherit from EventEmitter
 */
util.inherits(Board, EventEmitter);

// Static spot identifiers
Board.topLeft = 0;
Board.topMiddle = 1;
Board.topRight = 2;
Board.middleLeft = 3;
Board.middle = 4;
Board.middleRight = 5;
Board.bottomLeft = 6;
Board.bottomMiddle = 7;
Board.bottomRight = 8;

/**
 * getSpots
 * @returns {Array} The array of game spots
 */
Board.prototype.getSpots = function(){
    return this._spots;
};

/**
 * getOpenSpots
 * @returns {Array} Array of open slots
 */
Board.prototype.getOpenSpotIndexes = function(){
    return _.chain(this.getSpots())
        .map(function(spot, index){
            if(spot === 2){
                return index;
            }
        })
        .without(undefined)
        .value();
};

/**
 * setSpot
 * @param {Number} index Spot index to place token
 * @param {Number} num Value to place in spot
 * @returns {Object} this
 */
Board.prototype.setSpot = function(index, num){
    if(index > 8){
        throw new RangeError('Must set index between 0 and 8');
    }
    if (this.isSpotEmpty(index)){
        this._spots[index] = num;
    }
    return this;
};

/**
 * isSpotEmpty
 * @param {Number} index Spot index
 * @returns {Bool} returns if index is empty
 */
Board.prototype.isSpotEmpty = function(index){
    return this._spots[index] === 2;
};

/**
 * getTurn
 * @returns {Number} Turn number
 */
Board.prototype.getTurn = function(){
    return this._turn;
};

/**
 * getPlayerValue
 * Value used to place in spots for a player
 * @param {Number} player Player number (0-1)
 * @return {Number}
 */
Board.prototype.getPlayerValue = function(player){
    if (player < 0 || player > 1){
        throw new RangeError('Must specify player 0 or 1');
    }
    return player === 0 ? 3 : 5;
};

/**
 * incrementTurn
 * Increments the turn
 * @return {Object} this
 */
Board.prototype.incrementTurn = function(){
    this._turn++;
    return this;
};

/**
 * place
 * Places a token in a game spot
 * @param {Number} player Player number (0-1)
 * @param {Number} index Index of the token placement (0-8)
 */
Board.prototype.place = function(player, index){
    this.setSpot(index, this.getPlayerValue(player));
    this.incrementTurn();
    return this;
};

/**
 * registerPlayer
 * Registers a player
 */
Board.prototype.register = function(){

};

module.exports = Board;