var BoardController = require('../controllers/board-controller');
var Events = require('../events');

exports.fetch = function(req, res){
    BoardController.all(['_id', 'isComplete', 'turn', 'players', 'spots']).then(function(b){
        res.send(b);
    });
};

exports.create = function(req, res){
    BoardController.create().then(function(b){
        res.send({
            id: b.id
        });
    });
};

exports.addPlayer = function(req, res, next){
    if(req.body.boardid === null || req.body.playerid === null){
        res.send(500, 'Invalid parameters');
    }

    BoardController.addPlayer(req.body.boardid, req.body.playerid).then(function(b){
        res.send({
            success: true
        });
    }, next);
};

exports.removePlayer = function(req, res, next){
    if(req.body.boardid === null || req.body.playerid === null){
        res.send(500, 'Invalid parameters');
    }

    BoardController.removePlayer(req.body.boardid, req.body.playerid).then(function(b){
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

    BoardController.play(req.body.boardid, req.body.playerid, req.body.spot).then(function(b){
        res.send({
            success: true
        });
    }, next);
};