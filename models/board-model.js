var mongoose = require('mongoose');
var schema = require('./schemas/board-schema');
var config = require('../config').database;
var db = mongoose.createConnection(config.url);

module.exports = db.model('board', schema);