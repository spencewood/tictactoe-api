var Board = require('../app/board');

exports.create = function(req, res){
    var board = new Board();
    board.on('created', function(b){
        res.json({ id: b.id });
    });
};