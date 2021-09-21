const supplier = require("../controllers/supplier.controller.js");
var router = require("express").Router();

module.exports = app => {

    router.get("/getAll", supplier.findAll);
    router.post("/add", supplier.add);
    router.put("/update", supplier.update);

    app.use('/api/supplier', router);
};