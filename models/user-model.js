var mongoose = require('mongoose');
var schema = require('./schemas/user-schema');
var config = require('../config').database;
var db = mongoose.createConnection(config.url);

module.exports = db.model('user', schema);