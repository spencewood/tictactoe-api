if(process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Some Nouns'
    });
}

var express = require('express');
var board = require('./routes/board-route');
var http = require('http');
var path = require('path');
var config = require('./config');

var app = express();

// all environments
app.set('port', config.port);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// routes
app.post('/board', board.create);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});