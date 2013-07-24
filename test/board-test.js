var EventEmitter = require('events').EventEmitter;
var should = require('should');
var _ = require('underscore');
var Events = require('../events');
var Board = require('../app/board');

describe.skip('Board', function(){
    it('should be able to be instantiated', function(){
        new Board().should.be.instanceOf(Object);
    });

    it('should be capable of emitting events', function(){
        new Board().should.be.instanceOf(EventEmitter);
    });

    it('should emit a "created" event after document creation', function(done){
        var board = new Board();
        board.once('created', function(b){
            b.should.not.be.null;
            done();
        });
    });

    it('should emit a global "board:created" event after document creation', function(done){
        Events.once('board:created', function(b){
            b.should.not.be.null;
            done();
        });
        var board = new Board();
    });

    it('should create a board of 9 spots of 2 on setup', function(){
        var spots = new Board().getSpots();
        spots.length.should.equal(9);
        spots.every(function(spot){
            return spot === 2;
        });
    });

    it('should start with turn number 0 on board creation', function(){
        new Board().getTurn().should.equal(0);
    });

    describe('#getSpots', function(){
        it('should return the array of spots for the board', function(){
            new Board().getSpots().should.be.instanceOf(Array);
        });
    });

    describe('#setSpot', function(){
        it('should return the board instance', function(){
            var board = new Board();
            board.setSpot(0, 0).should.equal(board);
        });

        it('should not set spot value if spot is not empty', function(){
            var board = new Board();
            board.setSpot(0, 3);
            board.setSpot(0, 5).getSpots()[0].should.equal(3);
        });

        it('should throw an error if trying to set spots out of range', function(){
            var board = new Board();
            (function(){
                board.setSpot(11, 3);
            }).should.throw();
        });
    });

    describe('#isSpotEmpty', function(){
        it('should return whether or not the spot is empty', function(){
            var board = new Board();
            board.isSpotEmpty(0).should.be.true;
            board.setSpot(0, 3).isSpotEmpty().should.be.false;
        });
    });

    describe('#getTurn', function(){
        it('should return the turn number', function(){
            new Board().getTurn().should.equal(0);
        });
    });

    describe('#getPlayerValue', function(){
        it('should throw an error if the player is not 0 or 1', function(){
            var board = new Board();
            (function(){
                board.getPlayerValue(3);
            }).should.throw();
        });

        it('should return 3 for player one and 5 for player two', function(){
            var board = new Board();
            board.getPlayerValue(0).should.equal(3);
            board.getPlayerValue(1).should.equal(5);
        });
    });

    describe('#incrementTurn', function(){
        it('should increment the turn value by 1', function(){
            var board = new Board();
            board.incrementTurn();
            board._turn.should.equal(1);
        });

        it('should return the board instance', function(){
            var board = new Board();
            board.incrementTurn().should.equal(board);
        });
    });

    describe('#place', function(){
        it('should return the board instance', function(){
            var board = new Board();
            board.place('x', 0).should.equal(board);
        });

        it('should take a token and place it in the requested spot if empty', function(){
            var board = new Board().place(0, 0);
            board.getSpots()[0].should.not.equal(2);
        });

        it('should increment the turn number', function(){
            var board = new Board().place(0, 0);
            board.getTurn().should.equal(1);
        });
    });

    describe('#getOpenSpotIndexes', function(){
        it('should return proper number of open spots', function(){
            var board = new Board().place(0, 0).place(1, 1);
            board.getOpenSpotIndexes().length.should.equal(7);
        });
    });
});