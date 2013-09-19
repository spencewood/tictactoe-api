var config = require('../config');
var pubnub = require('pubnub').init({
    publish_key: config.pubnub.publish_key,
    subscribe_key: config.pubnub.subscribe_key
});
var Events = require('../events');
var AI = require('./ai');

var channel = function(name){
    return name + (config.isDevelopment ? '-dev' : '');
};

/**
 * Board Events
 */
Events.on('board:create', function(board){
    pubnub.publish({
        channel: channel('board:create'),
        message: {
            boardId: board._id
        }
    });
});

Events.on('board:join', function(board, playerId){
    pubnub.publish({
        channel: channel('board:join'),
        message: {
            boardId: board._id,
            playerId: playerId
        }
    });
});

Events.on('board:leave', function(board, playerId){
    pubnub.publish({
        channel: channel('board:leave'),
        message: {
            boardId: board._id,
            playerId: playerId
        }
    });
});

Events.on('board:ready', function(board){
    pubnub.publish({
        channel: channel('board:ready'),
        message: {
            boardId: board._id
        }
    });
});

Events.on('board:play', function(board, playerId, spot){
    pubnub.publish({
        channel: channel('board:play'),
        message: {
            boardId: board._id,
            playerId: playerId,
            spots: board.spots
        }
    });
});

Events.on('board:turn', function(board, playerId){
    if(playerId === 0){
        //AI plays if the playerId is 0
        AI.play(board._id);
    }
    else{
        //only broadcast if the turn is for a real player
        pubnub.publish({
            channel: channel('board:turn'),
            message: {
                boardId: board._id,
                playerId: playerId
            }
        });
    }
});

Events.on('board:complete', function(board){
    pubnub.publish({
        channel: channel('board:complete'),
        message: {
            boardId: board._id
        }
    });
});

Events.on('board:win', function(board, playerId){
    pubnub.publish({
        channel: channel('board:win'),
        message: {
            boardId: board._id,
            playerId: playerId
        }
    });
});

/**
 * User Events
 */
Events.on('user:loginEmail', function(user){
    pubnub.publish({
        channel: channel('user:loginEmail'),
        message: {
            token: user.token,
            email: user.email
        }
    });
});