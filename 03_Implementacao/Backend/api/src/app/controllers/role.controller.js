const db = require("../models");
const Role = db.Role;
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

// Retrieve all Roles from the database.
exports.findAll = (req, res) => {

  Role.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving meters."
      });
    });
};
