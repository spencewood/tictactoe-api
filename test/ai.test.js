var should = require('should');
var _ = require('underscore');
var Board = require('../app/board');
var AI = require('../app/ai');

describe('AI', function () {
    it('should be able to be instantiated', function () {
        new AI(new Board(1), 0).should.be.instanceOf(Object);
    });

    it('should throw if not passing a Board type', function () {
        (function () {
            new AI({});
        }).should.throw();
    });
    
    it('should throw if not passing a player', function () {
        (function () {
            new AI(new Board(1));
        }).should.throw();
    });

    describe('#go', function () {
        it('should return instance of AI', function () {
            var ai = new AI(new Board(1), 0);
            ai.go().should.equal(ai);
        });

        it('should make a move when calling go', function () {
            var board = new Board(1);
            var ai = new AI(board, 0);
            ai.go();
            board.getSpots().every(function (spot) {
                return spot === 2;
            }).should.be.false;
        });
    });
});