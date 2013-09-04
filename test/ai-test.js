/*jshint expr: true*/
/*global describe: true*/
/*global it: true*/
/*global after: true*/

var Promise = require('mongoose').Promise;
var BoardModel = require('../models/board-model');
var AI = require('../app/ai');

require('should');

describe('Board Routes', function(){
    after(function(){
        BoardModel.remove({}, function(err){
        });
    });

    describe('play', function(){
        it.skip('should return a promise', function(){
            AI.play(1).should.be.instanceOf(Promise);
        });

        it('should not play on a board with no ai player', function(done){
            BoardModel.create({
                players: [1, 2],
                spots: [2, 2, 2, 2, 2, 2, 2, 2, 2]
            }, function(err, model){
                AI.play(model._id).then(function(model){
                    //console.log('done', model);
                    done();
                }, function(err){
                    //console.log('error', err);
                    done();
                });
            });
        });

        it.skip('should play on a board with an ai player', function(done){
            BoardModel.create({
                players: [0, 1],
                spots: [2, 3, 5, 3, 5, 3, 5, 3, 5]
            }, function(err, model){
                //BoardController.play(model._id, 1, 0).then(function(b){
                //    b.isComplete.should.be.true;
                //    done();
                //});
            });
        });
    });
});