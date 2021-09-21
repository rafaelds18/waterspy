const notifications = require("../controllers/notifications.controller.js");
const { verifyToken } = require("../middleware/authJwt.js");

var router = require("express").Router();

module.exports = app => {
    router.get("", verifyToken, notifications.getNotifications);
    router.post("", verifyToken, notifications.sendNotification);
    app.use('/api/notifications', router);
};