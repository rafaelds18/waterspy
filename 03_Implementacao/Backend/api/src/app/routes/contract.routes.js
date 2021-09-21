const contract = require("../controllers/contract.controller.js");
const { verifyToken } = require("../middleware/authJwt.js");
var router = require("express").Router();

module.exports = app => {

    router.post("/add", verifyToken, contract.add);
    router.get("/detailsByUser", verifyToken, contract.detailsByUser);
    router.get("/all", verifyToken, contract.findAll);

    app.use('/api/contract', router);
};