/*jshint expr: true*/
/*global describe: true*/
/*global it: true*/
/*global after: true*/

var BoardModel = require('../models/board-model');
var AI = require('../app/ai');

require('should');

describe('Board Routes', function(){
    after(function(){
        BoardModel.remove({}, function(err){
        });
    });

    describe('play', function(){
        it('should fail when passing a bad boardid', function(done){
            AI.play(123).then(null, function(err){
                err.should.not.be.null;
                done();
            });
        });

        it('should not play on a board with no ai player', function(done){
            BoardModel.create({
                players: [1, 2],
                spots: [2, 2, 2, 2, 2, 2, 2, 2, 2]
            }, function(err, model){
                AI.play(model._id).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it('should play on a board with an ai player', function(done){
            BoardModel.create({
                players: [0, 1],
                spots: [2, 2, 2, 2, 2, 2, 2, 2, 2]
            }, function(err, model){
                AI.play(model._id).then(function(board){
                    board.should.not.be.null;
                    done();
                });
            });
        });

        it('should block opponent from winning', function(done){
            BoardModel.create({
                players: [0, 1],
                spots: [5, 5, 2, 3, 2, 2, 2, 3, 2],
                turn: 4
            }, function(err, model){
                AI.play(model._id).then(function(board){
                    board.getSpots()[2].should.equal(3);
                    done();
                });
            });
        });

        it('should make winning move if available', function(done){
            BoardModel.create({
                players: [0, 1],
                spots: [3, 3, 2, 5, 2, 2, 2, 5, 2],
                turn: 4
            }, function(err, model){
                AI.play(model._id).then(function(board){
                    board.getSpots()[2].should.equal(3);
                    done();
                });
            });
        });
    });
});