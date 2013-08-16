/*jshint expr: true*/
/*global describe: true*/
/*global it: true*/
/*global after: true*/

var Events = require('../events');
var Promise = require('mongoose').Promise;
var BoardController = require('../controllers/board-controller');
var BoardModel = require('../models/board-model');

require('should');

describe('Board Routes', function(){
    after(function(){
        BoardModel.remove({}, function(err){
        });
    });
});