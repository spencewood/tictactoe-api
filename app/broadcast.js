var config = require('../config');
var pubnub = require('pubnub').init({
    publish_key: config.pubnub.publish_key,
    subscribe_key: config.pubnub.subscribe_key
});
var Events = require('../events');

var channel = function(name){
    return name + (config.isDevelopment() ? '-dev' : '');
};

Events.on('board:created', function(board){
    pubnub.publish({
        channel: channel('board'),
        message: {
            id: board.id
        }
    });
});