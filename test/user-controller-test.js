/*jshint expr: true*/
/*global describe: true*/
/*global it: true*/
/*global after: true*/

var Promise = require('mongoose').Promise;
var UserController = require('../controllers/user-controller');
var UserModel = require('../models/user-model');
var Events = require('../events');

require('should');

describe.skip('Board Controller', function(){
    after(function(){
        UserModel.remove({}, function(err){
        });
    });

    describe('#findOne', function(){
        it('should return a promise', function(){
            UserController.findOne({ _id: 0 }).should.be.instanceOf(Promise);
        });

        it('should fail when passing an invalid board id', function(done){
            UserController.findOne({ _id: 0 }).then(null, function(err){
                err.should.not.be.null;
                done();
            });
        });
    });

    describe('#sendLoginEmail', function(){
        it('should return a promise', function(){
            UserController.sendLoginEmail('test@test.com').should.be.instanceOf(Promise);
        });

        it('should fail when not passing in a correct email address', function(done){
            UserController.sendLoginEmail('asdf').then(null, function(err){
                err.should.not.be.null;
                done();
            });
        });

        it('should resolve with the model when created', function(done){
            UserController.sendLoginEmail('test1@test.com').then(function(model){
                model.should.not.be.null;
                done();
            });
        });

        it('should return the same model if the email address already exists', function(done){
            UserController.sendLoginEmail('test2@test.com').then(function(model1){
                UserController.sendLoginEmail('test2@test.com').then(function(model2){
                    model1.token.should.not.be.null;
                    model1.token.should.equal(model2.token);
                    done();
                });
            });
        });

        it('should emit a global "user:loginEmail" event with user model', function(done){
            Events.once('user:loginEmail', function(model){
                model.should.not.be.null;
                done();
            });
            UserController.sendLoginEmail('test3@test.com');
        });
    });
});