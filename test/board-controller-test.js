var EventEmitter = require('events').EventEmitter;
var should = require('should');
var _ = require('underscore');
var Events = require('../events');
var Promise = require('mongoose').Promise;
var BoardController = require('../controllers/board-controller');
var BoardModel = require('../models/board-model');

describe('Board Controller', function(){
    describe('#create', function(){
        it('should return a promise', function(){
            BoardController.create().should.be.instanceOf(Promise);
        });

        it('should resolve with the new model', function(done){
            BoardController.create().then(function(b){
                b.should.be.instanceOf(BoardModel);
                done();
            });
        });

        it('should emit a global "board:created" event after document creation', function(done){
            Events.once('board:created', function(b){
                b.should.be.instanceOf(BoardModel);
                done();
            });
            BoardController.create();
        });
    });

    describe('#findOne', function(){
        it('should fail when passing and invalid board id', function(done){
            BoardController.findOne({ _id: 0 }).then(null, function(err){
                done();
            });
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
    });
});