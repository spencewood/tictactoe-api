var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Events = function(){};
util.inherits(Events, EventEmitter);

module.exports = new Events();