var config = require('../config');

module.exports = function(req, res, next){
    if(config.allowedDomains.indexOf(req.headers.origin) >= 0){
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // intercept OPTIONS method
        if (req.method === 'OPTIONS'){
            res.send(200);
        }
        else {
            next();
        }
    }
    else{
        res.send(403);
    }
};