const auth = require("../controllers/authentication.controller.js");
var router = require("express").Router();

module.exports = app => {
    // Allowing X-domain request
    var allowCrossDomain = function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    };
    app.use(allowCrossDomain);

    router.post("/login", auth.login);
    router.post("/register", auth.register);
    router.post("/confirmEmail", auth.confirmEmail);

    app.use('/api/auth', router);
};