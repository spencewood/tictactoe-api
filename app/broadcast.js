var config = require('../config');
var pubnub = require('pubnub').init({
    publish_key: config.pubnub.publish_key,
    subscribe_key: config.pubnub.subscribe_key
});
var Events = require('../events');

var channel = function(name){
    return name + (config.isDevelopment ? '-dev' : '');
};

Events.on('board:created', function(boardId){
    pubnub.publish({
        channel: channel('board:created'),
        message: {
            boardId: boardId
        }
    });
});

Events.on('board:join', function(boardId, playerId){
    pubnub.publish({
        channel: channel('board:join'),
        message: {
            boardId: boardId,
            playerId: playerId
        }
    });
});

Events.on('board:ready', function(boardId){
    pubnub.publish({
        channel: channel('board:ready'),
        message: {
            boardId: boardId
        }
    });
});

Events.on('board:leave', function(boardId, playerId){
    pubnub.publish({
        channel: channel('board:leave'),
        message: {
            boardId: boardId,
            playerId: playerId
        }
    });
});

Events.on('board:move', function(boardId, playerId, spot){
    pubnub.publish({
        channel: channel('board:move'),
        message: {
            boardId: boardId,
            playerId: playerId,
            spot: spot
        }
    });
});

Events.on('board:complete', function(boardId){
    pubnub.publish({
        channel: channel('board:complete'),
        message: {
            boardId: boardId
        }
    });
});