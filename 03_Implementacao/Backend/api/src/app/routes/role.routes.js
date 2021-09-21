module.exports = app => {
    const role = require("../controllers/role.controller.js");
    const { verifyToken } = require("../middleware/authJwt.js");
  
    var router = require("express").Router();

    //router.get("/", verifyToken, role.findAll);
    router.get("/", role.findAll);
  
    app.use('/api/role', router);
  };