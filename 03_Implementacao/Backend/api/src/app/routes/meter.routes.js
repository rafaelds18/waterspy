const meter = require("../controllers/meter.controller.js");
var router = require("express").Router();

module.exports = app => {

    router.post("/add", meter.add);
    router.get("", meter.findAll);
    router.get("/:contractId", meter.findByContract);

    app.use('/api/meter', router);
};