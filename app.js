if(process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Tic Tac Toe'
    });
}

var express = require('express');
var boards = require('./routes/board-route');
var http = require('http');
var path = require('path');
var config = require('./config');

var app = express();

var errorHandler = function(err, req, res, next){
    console.error(err);
    res.send(500, { error: err });
};

// all environments
app.set('port', config.port);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(errorHandler);

// development only
app.configure('development', function(){
    app.use(express.errorHandler());
});

// broadcast events
require('./app/broadcast');

// routes
app.get('/boards', boards.fetch);
app.post('/boards', boards.create);
app.post('/boards/addplayer', boards.addPlayer);
app.post('/board/sremovePlayer', boards.removePlayer);
app.post('/boards/play', boards.play);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});