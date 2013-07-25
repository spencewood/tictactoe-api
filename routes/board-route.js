var Board = require('../controllers/board-controller');
var Events = require('../events');

exports.create = function(req, res){
    Board.create().then(function(b){
        res.send({
            id: b.id
        });
    });
};

exports.addPlayer = function(req, res){
    if(req.body.boardid === null || req.body.playerid === null){
        res.send(500, 'Invalid parameters');
    }

    Board.addPlayer(req.body.boardid, req.body.playerid).then(function(b){
        res.send({
            success: true
        });
    }, function(err){
        res.send(500);
    });
};

exports.removePlayer = function(req, res){
    if(req.body.boardid === null || req.body.playerid === null){
        res.send(500, 'Invalid parameters');
    }

    Board.removePlayer(req.body.boardid, req.body.playerid).then(function(b){
        res.send({
            success: true
        });
    }, function(err){
        res.send(500);
    });
};

exports.play = function(req, res){
    
};