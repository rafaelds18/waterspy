module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Users
    router.get("/", user.findAll);

    // Retrieve all Users Details
    router.get("/details", user.findAllWithDetails);
  
    // // Retrieve a single User with id
    router.get("/:id", user.findOne);

    // // Retrieve a single User with email
    router.get("/email/:email", user.findByEmail);
  
    router.post("/add/user", user.add);
    
    router.put("/", user.update);
  
    app.use('/api/user', router);
  };