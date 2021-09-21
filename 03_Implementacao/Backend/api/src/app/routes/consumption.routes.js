module.exports = app => {
    const consumption = require("../controllers/consumption.controller.js");
    const multer = require('multer');
    const { verifyToken } = require("../middleware/authJwt.js");
  
    var router = require("express").Router();

    var uploading = multer({
      dest: __dirname + '/uploads/',
    }).single('image');
    
  
    // Post read consumption
    router.post("/read", verifyToken, uploading, consumption.readConsumption);
    // Post send consumption
    router.post("/send", verifyToken, consumption.sendConsumption);

    /**
     * GET SUM VALUES FROM EACH MONTH
     */
    router.get("/allSumConsumptions/:contractNumber/:meterNumber", verifyToken, consumption.getAllSumConsumptions);
    
    router.get("/weekAvgConsumptions/:contractNumber/:meterNumber", verifyToken, consumption.getAllWeekAvgConsumptions);

    router.get("/allWeekConsumptions/:contractNumber/:meterNumber", verifyToken, consumption.allWeekConsumptions);

    router.get("/consumptionsByMonth/:month/:contractNumber/:meterNumber", verifyToken, consumption.consumptionsByMonth);

    /**
     * GET ALL VALUES FROM EACH MONTH
     */
    router.get("/allConsumptions/:userId", verifyToken, consumption.getAllConsumptions);

    router.get("/allConsumptionsByContract/:contractNumber/:meterNumber", verifyToken, consumption.getAllConsumptionsByContract);

    router.get("/:meterId", consumption.getByMeter);
  
    app.use('/api/consumption', router);
  };