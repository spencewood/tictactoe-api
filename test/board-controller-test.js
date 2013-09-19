/*jshint expr: true*/
/*global describe: true*/
/*global it: true*/
/*global after: true*/

var Events = require('../events');
var Promise = require('mongoose').Promise;
var BoardController = require('../controllers/board-controller');
var BoardModel = require('../models/board-model');

require('should');

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

        it('should resolve with the new model', function(done){
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
                });
            });
        });

        it('should raise an event with board and player id when a player joins a board', function(done){
            Events.once('board:join', function(model, boardId, playerId){
                model.should.not.be.null;
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
                });
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

        it('should not let the same player join twice', function(done){
            BoardModel.create({ players: [1] }, function(err, model){
                BoardController.addPlayer(model._id, 1).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });
    });

    describe('#removePlayer', function(){
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
            Events.once('board:leave', function(model, boardId, playerId){
                model.should.not.be.null;
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
        it('should not be able to play when board is not ready', function(done){
            BoardModel.create({}, function(err, model){
                BoardController.play(model._id, 1, 1).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it('should add a 3 for turn 0 in the chosen spot', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.play(model._id, 1, 1).then(function(b){
                    b.getSpots()[1].should.equal(3);
                    done();
                });
            });
        });

        it('should add a 5 for turn 1 in the chosen spot', function(done){
            BoardModel.create({ players: [1, 2], turn: 1 }, function(err, model){
                BoardController.play(model._id, 2, 1).then(function(b){
                    b.getSpots()[1].should.equal(5);
                    done();
                });
            });
        });

        it('should emit a "board:play" event with board, player and spot', function(done){
            Events.once('board:play', function(model, boardId, playerId, spot){
                model.should.not.be.null;
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
                BoardController.play(model._id, 1, 1).then(function(b){
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
                BoardController.play(model._id, 1, 0).then(function(b){
                    b.isComplete.should.be.true;
                    done();
                });
            });
        });

        it('should raise global event with boardid when board is complete', function(done){
            Events.once('board:complete', function(board, boardId){
                board.should.not.be.null;
                boardId.should.not.be.null;
                done();
            });
            BoardModel.create({
                players: [1, 2],
                spots: [2, 3, 5, 3, 5, 3, 5, 3, 5]
            }, function(err, model){
                BoardController.play(model._id, 1, 0);
            });
        });

        it('should raise global "board:turn" event with boardid and correct playerid when there is a new turn', function(done){
            Events.once('board:turn', function(board, boardId, playerId){
                board.should.not.be.null;
                boardId.should.not.be.null;
                playerId.should.equal('2');
                done();
            });
            BoardModel.create({
                players: [1, 2]
            }, function(err, model){
                BoardController.play(model._id, 1, 0);
            });
        });

        it('should throw an error when trying to play with a playerid that isn\'t in the player list', function(done){
            BoardModel.create({}, function(err, model){
                BoardController.play(model._id, 2, 1).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it('should throw an error if the player plays out of turn', function(done){
            BoardModel.create({ players: [1, 2] }, function(err, model){
                BoardController.play(model._id, 2, 0).then(null, function(err){
                    err.should.not.be.null;
                    done();
                });
            });
        });

        it.skip('should emit a "board:win" event with board and winning player', function(done){
            Events.once('board:win', function(model, boardId, playerId){
                model.should.not.be.null;
                boardId.should.not.be.null;
                playerId.should.not.be.null;
                done();
            });
            BoardModel.create({
                players: [1, 2],
                spots: [3, 3, 2, 5, 2, 2, 2, 5, 2],
                turn: 4
            }, function(err, model){
                BoardController.play(model._id, 1, 2);
            });
        });

        it.skip('should store the winners userid on the board', function(done){

        });

        it.skip('should not be able to be played on when it is marked complete', function(done){

        });
    });
});