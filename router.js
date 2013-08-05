var User = require('./controllers/user-controller');
var BearerStrategy = require('passport-http-bearer').Strategy;
var boards = require('./routes/boards-route');
var accounts = require('./routes/accounts-route');

module.exports = function(app, passport){
    //auth
    passport.use(
        new BearerStrategy(function(token, done){
            console.log(token);
            User.findByToken(token).then(function(user){
                done(null, user);
            }, function(err){
                done(err);
            });
        })
    );

    //routes
    app.get('/boards', boards.fetch);
    app.post('/boards', passport.authenticate('bearer', { session: false }), boards.create);
    app.post('/boards/addplayer', boards.addPlayer);
    app.post('/boards/join', boards.addPlayer);
    app.post('/boards/removePlayer', boards.removePlayer);
    app.post('/boards/leave', boards.removePlayer);
    app.post('/boards/play', boards.play);
    app.post('/accounts/requestLogin', accounts.requestLogin);
    app.post('/accounts/whoAmI', accounts.whoAmI);
};