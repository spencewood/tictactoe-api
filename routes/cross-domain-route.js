var config = require('../config');

module.exports = function(req, res, next){
    console.log(req.headers.origin);
    if(config.allowedDomains.indexOf(req.headers.origin) >= 0){
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    }
    next();
};