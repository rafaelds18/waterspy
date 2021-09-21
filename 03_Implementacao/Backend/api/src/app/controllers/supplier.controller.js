const db = require("../models");
const Supplier = db.Supplier;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

// Retrieve all Suppliers from the database.
exports.findAll = (req, res) => {

  Supplier.findAll({
    where: {
      deleted: 0
    }
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving suppliers."
      });
    });
};

// Add Suppliers to the database.
exports.add = async (req, res) => {
  const supplier = {
    name: req.body.name,
    tin: req.body.tin,
    deleted: 0
  }
  
  const [createdSupplier, created] = await Supplier.findOrCreate({
    where: { tin: supplier.tin },
    defaults: supplier
  });

  if (created) {
    res.send({
      supplier: createdSupplier
    });    
  }
  else {
    res.status(409).send({
      code: 'SUPPLIER_EXISTS'
    });
  }
};

// Update a Supplier by tin in the request
exports.update = async (req, res) => {
  const supplier = req.body.supplier;
  
  await sequelize.query(
    'UPDATE [Supplier] SET name = :name, tin = :tin, deleted = :deleted WHERE id = :id',
    {
      replacements: { 
        id: supplier.id,
        name: supplier.name,
        tin: supplier.tin,
        deleted: supplier.deleted ? supplier.deleted : false
       },
      type: QueryTypes.UPDATE
    }
  ).then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving supplier."
    });
  });
};
