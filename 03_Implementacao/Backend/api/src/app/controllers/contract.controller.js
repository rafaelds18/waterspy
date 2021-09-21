const db = require("../models");
const Contract = db.Contract;
const Meter = db.Meter;
const UserContract = db.UserContract;
const User = db.User;
const Op = db.Sequelize.Op;
const { sequelize, Supplier, Consumption } = require("../models");
const { QueryTypes } = require("sequelize");
const authJwt = require('../middleware/authJwt');

// Retrieve all Contracts from the database.
exports.findAll = (req, res) => {
  Contract.findAll({
    where: { deleted: false },
    include: [{
      model: Supplier,
      as: 'supplier'
    },
    {
      model: User,
      as: 'users'
    }]
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contracts."
      });
    });
};

/**
 * Retreive contract by number and supllier_id
 *  */
exports.findByNumber = async (req, res) => {
  const contractNumber = req.body.contractNumber;
  const supplierId = req.body.supplierId;

  await sequelize.query(
    'SELECT * FROM Contract WHERE contractNumber = :contractNumber AND supplierId = :supplierId AND deleted = 0',
    {
      replacements: {
        contractNumber: contractNumber,
        supplierId: supplierId
      },
      type: QueryTypes.SELECT
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

/**
 * Retreive contract by user
 *  */
exports.detailsByUser = async (req, res) => {
  const userId = req.userId;

  await sequelize.query(
    'SELECT contractId FROM UserContract WHERE userId = :userId',
    {
      replacements: {
        userId: userId
      },
      type: QueryTypes.SELECT
    }
  ).then(async data => {
    let contracts = [];
    data.forEach(el => {
      contracts.push(el.contractId);
    });

    Contract.findAll({
      where: {
        id: { [Op.in]: contracts }
      },
      include: [{
        model: Supplier,
        as: 'supplier'
      },
    {
      model: User,
      as: 'users'
    }]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving contract."
        });
      });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contract."
      });
    });

};

/**
 * Retreive contract details
 *  */
 exports.details = async (req, res) => {
  const contractNumber = req.params.contractNumber;

  Contract.findAll({
    where: {
      contractNumber: contractNumber
    },
    include: [{
      model: Supplier,
      as: 'supplier'
    },
    {
      model: User,
      as: 'users'
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contract."
      });
    });
};

// Add Contract
exports.add = async (req, res) => {
  let contract = {
    contractNumber: req.body.contract.contractNumber,
    description: req.body.contract.description,
    supplierId: req.body.contract.supplierId,
    deleted: 0
  };

  let email = req.body.email;
  let meters = req.body.meters;
  const userId = req.userId;  

  const t = await sequelize.transaction();

  try {
    // Create Contract
    const [createdContract, created] = await Contract.findOrCreate({
      where: { contractNumber: contract.contractNumber, deleted: false },
      defaults: contract
    });

    let contractId = createdContract.dataValues.Id;

    // Create Meter
    if (created) {
      if (meters) {
        meters.forEach(async meter => {
          let valInitMeter = meter.valInitMeter;
          const newMeter = {
            meterNumber: meter.meterNumber,
            contractId: contractId,
            deleted: 0
          };

          const [createdMeter, created] = await Meter.findOrCreate({
            where: { meterNumber: newMeter.meterNumber },
            defaults: newMeter
          });

          if(created){
            Consumption.create({
              meterId: createdMeter.dataValues.Id,
              value: valInitMeter,
              date: db.Sequelize.fn('GETDATE')
            });
          }
        });
      }
      // Create UserContract
      if (userId) {
        await UserContract.findOrCreate({
          where: {
            userId: userId,
            contractId: contractId
          }
        });

      }
      res.status(200).send({
        code: 'CONTRACT_ADDED'
      });

      await t.commit();
    }
    else {
      res.status(409).send({
        code: 'USER_EXISTS'
      });
    }
  }
  catch (error) {
    await t.rollback();
  }

};

exports.getContractId = async function (contractNumber, supplierId) {
  await sequelize.query(
    'SELECT Id FROM Contract WHERE contractNumber = :contractNumber AND supplierId = :supplierId AND deleted = 0',
    {
      replacements: {
        contractNumber: contractNumber,
        supplierId: supplierId
      },
      type: QueryTypes.SELECT
    }
  ).then(data => {
    return data[0].Id;
  })
  .catch(err => {
    return null;
  });
}