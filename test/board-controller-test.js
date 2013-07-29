var EventEmitter = require('events').EventEmitter;
var should = require('should');
var _ = require('underscore');
var Events = require('../events');
var Promise = require('mongoose').Promise;
var BoardController = require('../controllers/board-controller');
var BoardModel = require('../models/board-model');

describe('Board Controller', function(){
    after(function(){
        BoardModel.remove({}, function(err){
        });
    });

    describe('#findOne', function(){
        it('should return a promise', function(){
            BoardController.findOne({ _id: 0 }).should.be.instanceOf(Promise);
        });

        it('should fail when passing an invalid board id', function(done){
            BoardController.findOne({ _id: 0 }).then(null, function(err){
                done();
            });
        });
    });

    describe('#all', function(){
        it('should return a promise', function(){
            BoardController.all().should.be.instanceOf(Promise);
        });
    });

    describe('#create', function(){
        it('should return a promise', function(){
            BoardController.create().should.be.instanceOf(Promise);
        });

        it('should resolve with the new model id', function(done){
            BoardController.create().then(function(b){
                b.should.not.be.null;
                done();
            });
        });

        it('should emit a global "board:create" event after document creation', function(done){
            Events.once('board:create', function(b){
                b.should.not.be.null;
                done();
            });
            BoardController.create();
        });
    });

    describe('#addPlayer', function(){
        it('should return a promise', function(){
            BoardController.addPlayer(123, 1).should.be.instanceOf(Promise);
        });

        it('should fail when passing an invalid board id', function(done){
            BoardController.addPlayer(123, 1).then(null, function(err){
                err.should.not.be.null;
                done();
            });
        });

        it('should add a player to an existing board', function(done){
            BoardController.create().then(function(b){
                b.players.length.should.equal(0);
                BoardController.addPlayer(b._id, 1).then(function(m){
                    m.players.length.should.equal(1);
                    done();
                }).end();
            });
        });

        it('should raise an event with board and player id when a player joins a board', function(done){
            Events.once('board:join', function(boardId, playerId){
                boardId.should.not.be.null;
                playerId.should.not.be.null;
                done();
            });
            BoardController.create().then(function(b){
                BoardController.addPlayer(b._id, 1);
            });
        });

        it('should fail when adding too many players to a board', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.addPlayer(model._id, 3).then(null, function(err){
                    err.should.not.be.null;
                    done();
                }).end();
            });
        });

        it('should raise a "board:ready" event with boardid when two players have joined a board', function(done){
            Events.once('board:ready', function(boardId){
                boardId.should.not.be.null;
                done();
            });

            BoardModel.create({ players: [1] }, function(err, model){
                BoardController.addPlayer(model._id, 2);
            });
        });
    });

    describe('#removePlayer', function(){
        it('should return a promise', function(){
            BoardController.removePlayer(123, 1).should.be.instanceOf(Promise);
        });

        it('should fail when removing an invalid user from an existing board', function(done){
            BoardModel.create({}, function(err, model){
                BoardController.removePlayer(model._id, 1).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it('should fail when removing a user from an invalid board', function(done){
            BoardController.removePlayer(1, 1).then(null, function(err){
                err.should.not.be.null;
                done();
            });
        });

        it('should make the board not ready when there are not enough players', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                model.isReady().should.be.true;
                BoardController.removePlayer(model._id, 1).then(function(b){
                    b.isReady().should.be.false;
                    done();
                });
            });
        });

        it('should emit a "board:leave" event with the boardid and playerid', function(done){
            Events.once('board:leave', function(boardId, playerId){
                boardId.should.not.be.null;
                playerId.should.not.be.null;
                done();
            });
            BoardModel.create({ players: [1] }, function(err, model){
                BoardController.removePlayer(model._id, 1);
            });
        });
    });

    describe('#play', function(){
        it('should return a promise', function(){
            BoardController.play(123, 1, 1).should.be.instanceOf(Promise);
        });

        it('should not be able to play when board is not ready', function(done){
            BoardModel.create({}, function(err, model){
                BoardController.play(model._id, 1, 1).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it('should add a 3 for player 1 in the chosen spot', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.play(model._id, 1, 1).then(function(b){
                    b.getSpots()[1].should.equal(3);
                    done();
                });
            });
        });

        it('should add a 5 for player 2 in the chosen spot', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.play(model._id, 2, 1).then(function(b){
                    b.getSpots()[1].should.equal(5);
                    done();
                });
            });
        });

        it('should emit a "board:move" event with board, player and spot', function(done){
            Events.once('board:move', function(boardId, playerId, spot){
                boardId.should.not.be.null;
                playerId.should.not.be.null;
                spot.should.not.be.null;
                done();
            });
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.play(model._id, 1, 1);
            });
        });

        it('should return an error when trying to move to a taken spot', function(done){
            BoardModel.create({
                players: [1, 2],
                spots: [2, 3, 2, 2, 2, 2, 2, 2, 2]
            }, function(err, model){
                BoardController.play(model._id, 2, 1).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it('should increment the turn', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.play(model._id, 2, 1).then(function(b){
                    b.getTurn().should.equal(1);
                    done();
                });
            });
        });

        it('should set isComplete to true when all spots are taken', function(done){
            BoardModel.create({
                players: [1, 2],
                spots: [2, 3, 5, 3, 5, 3, 5, 3, 5]
            }, function(err, model){
                BoardController.play(model._id, 2, 0).then(function(b){
                    b.isComplete.should.be.true;
                    done();
                });
            });
        });

        it('should raise global event with boardid when board is complete', function(done){
            Events.once('board:complete', function(boardId){
                boardId.should.not.be.null;
                done();
            });
            BoardModel.create({
                players: [1, 2],
                spots: [2, 3, 5, 3, 5, 3, 5, 3, 5]
            }, function(err, model){
                BoardController.play(model._id, 2, 0);
            });
        });
    });
});