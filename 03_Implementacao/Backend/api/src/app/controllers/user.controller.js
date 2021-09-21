const db = require("../models");
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;
const { sequelize, Contract } = require("../models");
const { QueryTypes } = require("sequelize");

// Retrieve all Users from the database.
exports.findAll = (req, res) => {

  User.findAll({
    where: { deleted: false }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Retrieve all Users with details from the database.
exports.findAllWithDetails = async (req, res) => {

  User.findAll({
    include: [
      {
        model: Role,
        as: 'roles'
      },
      {
        model: Contract,
        as: 'contracts'
      }
    ]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// // Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// // Find a single User with email
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({
    where: {
      email: email,
      deleted: false
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email
      });
    });
};

// Add a User in the request
exports.add = async (req, res) => {
  const user = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    imageName: 'fig_profile_' + req.body.email,
    image: req.body.image,
    imageType: req.body.imageType,
    deleted: 0,
    createdOn: db.Sequelize.fn('GETDATE'),
    createdBy: req.body.createdBy,
    updatedOn: db.Sequelize.fn('GETDATE'),
    updatedBy: req.body.updatedBy,
    version: 1
  }
  
  const [createdUser, created] = await User.findOrCreate({
    where: { email: user.email },
    defaults: user
  });

  if (created) {
    res.send({
      user: createdUser
    });    
  }
  else {
    res.status(409).send({
      code: 'USER_EXISTS'
    });
  }
};

// Update a User by the email in the request
exports.update = async (req, res) => {
  const user = req.body.user;

  await sequelize.query(
    'UPDATE [User] SET firstName = :firstName, lastName = :lastName, imageName = :imageName, image = :image, imageType = :imageType, updatedOn = :updatedOn, updatedBy = :updatedBy WHERE id = :id',
    {
      replacements: { 
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageName: user.imageName,
        image: user.image,
        imageType: user.imageType,
        updatedOn: user.updatedOn,
        updatedBy: user.updatedBy,
       },
      type: QueryTypes.UPDATE
    }
  ).then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving contract."
    });
  });
};