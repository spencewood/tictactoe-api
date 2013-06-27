var should = require('should');
var _ = require('underscore');
var Board = require('../app/board');

describe('Board', function () {
    it('should be able to be instantiated', function () {
        new Board(1).should.be.instanceOf(Object);
    });

    it('should require that an id is passed when creating a new board', function () {
        (function () {
            new Board();
        }).should.throw();
    });

    it('should create a board of 9 spots of 2 on setup', function () {
        var spots = new Board(1)._spots;
        spots.length.should.equal(9);
        spots.every( function (value) {
            return value === 2;
        });
    });

    it('should start with turn number 0 on board creation', function () {
        new Board(1)._turn.should.equal(0);
    });

    describe('getSpots', function () {
        it('should return the array of spots for the board', function () {
            new Board(1).getSpots().should.be.instanceOf(Array);
        });
    });

    describe('setSpot', function () {
        it('should return the board instance', function () {
            var board = new Board(1);
            board.setSpot(0, 0).should.equal(board);
        });

        it('should not set spot value if spot is not empty', function () {
            var board = new Board(1);
            board.setSpot(0, 3);
            board.setSpot(0, 5).getSpots()[0].should.equal(3);
        });

        it('should throw an error if trying to set spots out of range', function () {
            var board = new Board(1);
            (function () {
                board.setSpot(11, 3);
            }).should.throw();
        });
    });

    describe('isSpotEmpty', function () {
        it('should return whether or not the spot is empty', function () {
            var board = new Board(1);
            board.isSpotEmpty(0).should.be.true;
            board.setSpot(0, 3).isSpotEmpty().should.be.false;
        });
    });

    describe('getTurn', function () {
        it('should return the turn number', function () {
            new Board(1).getTurn().should.equal(0);
        });
    });

    describe('getPlayerValue', function () {
        it('should throw an error if the player is not 0 or 1', function () {
            var board = new Board(1);
            (function () {
                board.getPlayerValue(3);
            }).should.throw();
        });

        it('should return 3 for player one and 5 for player two', function () {
            var board = new Board(1);
            board.getPlayerValue(0).should.equal(3);
            board.getPlayerValue(1).should.equal(5);
        });
    });

    describe('place', function () {
        it('should return the board instance', function () {
            var board = new Board(1);
            board.place('x', 0).should.equal(board);
        });

        it('should take a token and place it in the requested spot if empty', function () {
            var board = new Board(1).place(0, 0);
            board.getSpots()[0].should.not.equal(2);
        });

        it('should increment the turn number', function () {
            var board = new Board(1).place(0, 0);
            board.getTurn().should.equal(1);
        });
    });
});