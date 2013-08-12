if(process.env.NODETIME_ACCOUNT_KEY){
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Tic Tac Toe'
    });
}

var express = require('express');
var passport = require('passport');

var http = require('http');
var config = require('./config');

var app = express();

// all environments
app.set('port', config.port);
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.sessionKey }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());

// development only
app.configure('development', function(){
    app.use(express.errorHandler());
});

// broadcast events
require('./app/broadcast');

//router
require('./router')(app, passport);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});