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

// error handling
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

    //routes
    app.get('/boards', boards.fetch);
    app.post('/accounts/requestLogin', accounts.requestLogin);

    app.get('/accounts/whoAmI', passport.authenticate('bearer', { session: false }), accounts.whoAmI);
    app.post('/boards', passport.authenticate('bearer', { session: false }), boards.create);
    app.post('/boards/addplayer', passport.authenticate('bearer', { session: false }), boards.addPlayer);
    app.post('/boards/join', passport.authenticate('bearer', { session: false }), boards.addPlayer);
    app.post('/boards/removePlayer', passport.authenticate('bearer', { session: false }), boards.removePlayer);
    app.post('/boards/leave', passport.authenticate('bearer', { session: false }), boards.removePlayer);
    app.post('/boards/play', passport.authenticate('bearer', { session: false }), boards.play);
};