var User = require('../controllers/user-controller');

exports.requestLogin = function(req, res, next){
    User.sendLoginEmail(req.body.email).then(function(u){
        res.send(200);
    }, next);
};

exports.whoAmI = function(req, res, next){
    User.findByToken(req.body.token).then(function(u){
        res.send(u);
    }, next);
};