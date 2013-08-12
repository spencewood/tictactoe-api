if(process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Tic Tac Toe'
    });
}

var express = require('express');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var boards = require('./routes/boards-route');
var accounts = require('./routes/accounts-route');
var cors = require('./routes/cors');
var http = require('http');
var config = require('./config');
var User = require('./controllers/user-controller');

var app = express();
passport.use(
    new BearerStrategy(function(token, done){
        User.findByToken(token).then(done);
    })
);

var errorHandler = function(err, req, res, next){
    if(!err){
        return next();
    }
    console.error(err);
    res.send(500, { error: err });
};

// all environments
app.set('port', config.port);
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.sessionKey }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(cors);
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
app.post('/boards/join', boards.addPlayer);
app.post('/boards/removePlayer', boards.removePlayer);
app.post('/boards/leave', boards.removePlayer);
app.post('/boards/play', boards.play);
app.post('/accounts/requestLogin', accounts.requestLogin);
app.post('/accounts/whoAmI', accounts.whoAmI);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});