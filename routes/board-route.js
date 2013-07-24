var Board = require('../controllers/board-controller');

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
    });
};