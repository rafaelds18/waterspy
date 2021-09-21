const db = require("../models");
const Contract = db.Contract;
const Meter = db.Meter;
const contractController = require("./contract.controller.js");
const { sequelize, Supplier } = require("../models");
const { QueryTypes } = require("sequelize");

// Retrieve all Meters from the database.
exports.findAll = (req, res) => {

  Meter.findAll()
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

// Retrieve all Meters by Contract from the database.
exports.findByContract = (req, res) => {
    Meter.findAll({
        where: {
            contractId: req.params.contractId
        }
    })
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

// Add Meters
exports.add = async (req, res) => {
    
    let meters =  req.body.meters;
    let contractNumber = req.body.contractNumber;
    let supplierId = req.body.supplierId;
    let contractId;

    await sequelize.query(
      'SELECT Id FROM Contract WHERE contractNumber = :contractNumber AND supplierId = :supplierId',
      {
        replacements: {
          contractNumber: contractNumber,
          supplierId: supplierId
        },
        type: QueryTypes.SELECT
      }
    ).then(data => {
      contractId = data[0].Id;
    })
    .catch(err => {
      return null;
    });

    await Meter.destroy({
      where: {
        contractId: contractId
      }
    });

    meters.forEach(async el => {
      let valInitMeter = el.valInitMeter;
      const meter = {
          meterNumber: el.meterNumber,
          contractId: contractId,
          deleted: 0
      };

      const [createdMeter, created] = await Meter.findOrCreate({
      where: { MeterNumber: el.meterNumber },
      defaults: meter
      });

      if (created) {
        
        Consumption.create({
          meterId: createdMeter.dataValues.Id,
          value: valInitMeter,
          date: db.Sequelize.fn('GETDATE')
        });
        
         res.status(200).send({
              code: 'METER_ADDED'
          });
      }
      else {
          res.status(409).send({
              code: 'METER_EXISTS'
          });
      }
  });
};