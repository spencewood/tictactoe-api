var Board = require('../controllers/board-controller');
var Events = require('../events');

exports.fetch = function(req, res){
    Board.all(['_id', 'isComplete', 'turn', 'players']).then(function(b){
        res.send(b);
    });
};

exports.create = function(req, res){
    Board.create().then(function(b){
        res.send({
            id: b.id
        });
    });
};

exports.addPlayer = function(req, res, next){
    if(req.body.boardid === null || req.body.playerid === null){
        res.send(500, 'Invalid parameters');
    }

    Board.addPlayer(req.body.boardid, req.body.playerid).then(function(b){
        res.send({
            success: true
        });
    }, next);
};

exports.removePlayer = function(req, res, next){
    if(req.body.boardid === null || req.body.playerid === null){
        res.send(500, 'Invalid parameters');
    }

    Board.removePlayer(req.body.boardid, req.body.playerid).then(function(b){
        res.send({
            success: true
        });
    }, next);
};

exports.play = function(req, res, next){
    if(req.body.boardid === null ||
        req.body.playerid === null ||
        req.body.spot === null){
        res.send(500, 'Invalid parameters');
    }

    Board.play(req.body.boardid, req.body.playerid, req.body.spot).then(function(b){
        res.send({
            success: true
        });
    }, next);
};