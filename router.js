var User = require('./controllers/user-controller');
var BearerStrategy = require('passport-http-bearer').Strategy;
var boards = require('./routes/boards-route');
var accounts = require('./routes/accounts-route');
var cors = require('./routes/cors');

//strategy
var bearer = new BearerStrategy(function(token, done){
    User.findByToken(token).then(function(user){
        done(null, user);
    }, function(err){
        done(err);
    });
});

//error handling
var errorHandler = function(err, req, res, next){
    if(!err){
        return next();
    }
    console.error(err);
    res.send(500, { error: err });
};

module.exports = function(app, passport){
    passport.use(bearer);
    app.use(cors);
    app.use(app.router);
    app.use(errorHandler);

    //auth
    var requireToken = passport.authenticate('bearer', { session: false });

    //routes
    app.get('/boards', boards.fetch);
    app.post('/accounts/requestLogin', accounts.requestLogin);

    app.get('/accounts/whoAmI', requireToken, accounts.whoAmI);
    app.post('/boards', requireToken, boards.create);
    app.post('/boards/addplayer', requireToken, boards.addPlayer);
    app.post('/boards/join', requireToken, boards.addPlayer);
    app.post('/boards/removePlayer', requireToken, boards.removePlayer);
    app.post('/boards/leave', requireToken, boards.removePlayer);
    app.post('/boards/play', requireToken, boards.play);
};