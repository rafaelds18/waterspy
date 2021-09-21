const db = require("../models");
const ocr = require("../services/ocr.services.js");
const Consumption = db.Consumption;
const Contract = db.Contract;
const Meter = db.Meter;
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const ManagementConsumption = require("../../api-management-consumption/controllers/management-consumption.controller");


exports.readConsumption = async (req, res) => {
  const imgPath = "../src/img-opt.jpg";
  
  let consumption = await ocr.readConsumption(req.body, req.file.path);

  ocr.removeFile(req.file.path);
  
  if (consumption != '') {
    res.send({
      consumption: consumption
    });
  }
  else {
    res.status(409).send({
      code: 'CONSUMPTION_ERROR_READ'

    });
  }
};

exports.sendConsumption = async (req, res) => {
  let user = req.userId;
  let email = req.email;

  const consumption = {
    meterId: req.body.meterId,
    value: req.body.value,
    date: db.Sequelize.fn('GETDATE')
  };

  let meter = await Meter.findOne({
    where: {
      id: req.body.meterId
    }
  });

  let contract = await Contract.findOne({
    where: {
      id: meter.contractId
    }
  });

  Consumption.create({
    meterId: consumption.meterId,
    value: consumption.value,
    date: db.Sequelize.fn('GETDATE')
  }).then(async data => {
    
    await ManagementConsumption.receiveReadingResponse(consumption.value, contract, meter, user, email);
    let date = new Date();
    let currentDay = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let initialDate = new Date(year, month, 1,00,00,00,000);
    let finalDate = new Date(year, month, 0,23,59,59,999);
    
    if(currentDay == finalDate.getDate()){
      sequelize.query(
        'SELECT SUM( CAST(Value AS INT)) FROM Consumption WHERE MeterId = :meterId AND (Date >= :initialDate AND Date <= :finalDate)',
        {
          replacements: { 
            meterId: meter.id,
            initialDate: initialDate,
            finalDate: finalDate
           },
          type: QueryTypes.SELECT
        }
      ).then(value => {
        ManagementConsumption.sendBill(value , contract.supplierId, user, email);
      })      
    }
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
 * Retreive consumptions by meter
 *  */
 exports.getByMeter = async (req, res) => {
  const meterId = req.params.meterId;

  await sequelize.query(
    'SELECT id, meterId, value, date FROM Consumption WHERE meterId = :meterId and deleted = 0',
    {
      replacements: {
        meterId: meterId
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
 * GET ALL VALUES FROM EACH MONTH
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllConsumptions = async (req, res) => {
  const userId = req.userId;

  if (req.params.userId) {
    userId = req.params.userId;
  }

  await sequelize.query(
    "SELECT consumption.id, consumption.meterId, "
    + "consumption.value, FORMAT(consumption.date, 'MMMM', 'pt-PT') AS month " 
    + "FROM Consumption AS consumption INNER JOIN Meter AS meter ON consumption.MeterId = meter.Id "
    + "INNER JOIN Contract AS contract ON meter.ContractId = contract.Id "
    + "INNER JOIN UserContract AS userContract ON contract.Id = userContract.ContractId WHERE userContract.UserId = :userId",
    {
      replacements: {
        userId: userId
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
 * GET ALL VALUES FROM EACH MONTH
 * @param {*} req 
 * @param {*} res 
 */
 exports.getAllConsumptionsByContract = async (req, res) => {
  let contractNumber = req.params.contractNumber;
  let meterNumber = req.params.meterNumber;

  await sequelize.query(
    "SELECT consumption.id, "
    + "consumption.value, FORMAT(consumption.date, 'MMMM', 'pt-PT') AS month, " 
    + "consumption.date, meter.meterNumber, contract.contractNumber "
    + "FROM Consumption AS consumption INNER JOIN Meter AS meter ON consumption.meterId = meter.id "
    + "INNER JOIN Contract AS contract ON meter.contractId = contract.id "
    + "WHERE (contract.contractNumber = :contractNumber OR :contractNumber IS NULL) "
    + "AND (meter.meterNumber = :meterNumber OR :meterNumber IS NULL) ",
    {
      replacements: {
        contractNumber: contractNumber == 'null' ? null : contractNumber,
        meterNumber: meterNumber == 'null' ? null : meterNumber
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
 * GET SUM VALUES FROM EACH MONTH
 * @param {*} req 
 * @param {*} res 
 */
 exports.getAllSumConsumptions = async (req, res) => {
  const userId = req.userId;
  await sequelize.query(
    ";WITH MonthConsumptions AS ( "
      + "SELECT "
        + "ROW_NUMBER() OVER(PARTITION BY FORMAT(consumption.[Date],'MM') ORDER BY consumption.Date) AS id, "
        + "FORMAT(consumption.[Date],'MM') AS month, "
         + "consumption.Value as value "  
          + "FROM [WaterSpy].[dbo].[Consumption] AS consumption "   
             + "INNER JOIN [WaterSpy].[dbo].[Meter] AS meter "  
            + "ON consumption.MeterId = meter.Id " 
              + "INNER JOIN [WaterSpy].[dbo].[Contract] AS contract " 
            + "ON meter.ContractId = contract.Id " 
              + "INNER JOIN [WaterSpy].[dbo].[UserContract] AS userContract "  
            + "ON contract.Id = userContract.ContractId " 
          + "WHERE " 
          + "userContract.UserId = :userId " 
          + "AND (contract.contractNumber = :contractNumber OR :contractNumber IS NULL) " 
          + "AND (meter.meterNumber = :meterNumber OR :meterNumber IS NULL) " 
          + "AND DATEPART(YYYY,consumption.[Date]) = DATEPART(YYYY,GETDATE()) "
          + "GROUP BY consumption.[Date], consumption.[Value] " 	
      + "),CalculateConsumptions AS ( "
      + "SELECT "
      + "id, month, "
       + "CAST(value AS INT) AS initial, "
         + "CAST(value AS INT) - ISNULL(( "
          + "SELECT top 1 CAST(value AS INT) "
          + "FROM MonthConsumptions m "
          + "WHERE m.id < MonthConsumptions.id "
          + "ORDER BY id DESC "
        + "), 0) AS consumption "
      + "FROM MonthConsumptions "
      + ") "
      + "SELECT "
       + "month, "
       + "CAST(AVG(CAST(consumption AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS value	"
      + "FROM CalculateConsumptions "
      + "WHERE id > 1 "
      + "GROUP BY CalculateConsumptions.month ",
    {
      replacements: {
        userId: userId,
        contractNumber: req.params.contractNumber == 'null' ? null : req.params.contractNumber,
        meterNumber: req.params.meterNumber == 'null' ? null : req.params.meterNumber
      },
      type: QueryTypes.SELECT
    }
  ).then(data => {


    if( data.length != 0 ){
      res.send(translateMonth(data));
    }else{
      let consumptions = [];
      let d =  new Date();
      let monthParam = d.getMonth() + 1; 
      let numberMonth = monthParam < 10 ? "0" + monthParam : monthParam + "";
      let month = getMonth(numberMonth);
      let consumption ={
        value: 0,
        name: month
      };
      consumptions.push(consumption);
      res.send(consumptions);
    }
    
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contract."
      });
    });
};


exports.getAllWeekAvgConsumptions = async (req, res) => {
  const userId = req.userId;
  await sequelize.query(
    "SELECT DISTINCT "
      + "CONVERT(VARCHAR(20),MAX(CAST(value AS INT)) OVER (ORDER BY DATEPART(wk,consumption.[Date])),1) AS max_value, "
      + "CONVERT(VARCHAR(20),AVG(CAST(value AS INT)) OVER (ORDER BY DATEPART(wk,consumption.[Date])),1) AS average "
    + "FROM [WaterSpy].[dbo].[Consumption] AS consumption " 
        + "INNER JOIN [WaterSpy].[dbo].[Meter] AS meter "
          + "ON consumption.MeterId = meter.Id "
        + "INNER JOIN [WaterSpy].[dbo].[Contract] AS contract "
          + "ON meter.ContractId = contract.Id "
        + "INNER JOIN [WaterSpy].[dbo].[UserContract] AS userContract "
          + "ON contract.Id = userContract.ContractId "
      + "WHERE "
        + "userContract.UserId = :userId "
      + "AND "
        + "(contract.contractNumber = :contractNumber OR :contractNumber IS NULL) "
      + "AND "
        +"(meter.meterNumber = :meterNumber OR :meterNumber IS NULL) "
      + "AND " 
        + "DATEPART(wk,consumption.[Date]) = DATEPART(wk,GETDATE())"
      + "AND "
        + "DATEPART(YYYY,consumption.[Date]) = DATEPART(YYYY,GETDATE())",
    {
      replacements: {
        userId: userId,
        contractNumber: req.params.contractNumber == 'null' ? null : req.params.contractNumber,
        meterNumber: req.params.meterNumber == 'null' ? null : req.params.meterNumber
      },
      type: QueryTypes.SELECT
    }
  ).then(data => {
    let value = data.length == 0 ? data=[{ max_value: 0, average: 0}]: data;
    res.send(value);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contract."
      });
    });
};

exports.allWeekConsumptions = async (req, res) => {
  const userId = req.userId;
  
  await sequelize.query(
    "SELECT " 
    + "FORMAT(consumption.[Date],'MM') AS month, "
    + "convert(VARCHAR, consumption.[Date], 23) AS date, "
    + "Value "
    + "FROM [WaterSpy].[dbo].[Consumption] AS consumption " 
      + "INNER JOIN [WaterSpy].[dbo].[Meter] AS meter "
        + "ON consumption.MeterId = meter.Id "
      + "INNER JOIN [WaterSpy].[dbo].[Contract] AS contract "
        + "ON meter.ContractId = contract.Id "
      + "INNER JOIN [WaterSpy].[dbo].[UserContract] AS userContract "
        + "ON contract.Id = userContract.ContractId "
    + "WHERE "
      + "userContract.UserId = :userId "
    + "AND "
      + "(contract.contractNumber = :contractNumber OR :contractNumber IS NULL) "
    + "AND "
      +"(meter.meterNumber = :meterNumber OR :meterNumber IS NULL) "
    + "AND " 
      + "DATEPART(wk,consumption.[Date]) = DATEPART(wk,GETDATE()) "
    + "AND "
      + "DATEPART(YYYY,consumption.[Date]) = DATEPART(YYYY,GETDATE())",
    {
      replacements: {
        userId: userId,
        contractNumber: req.params.contractNumber == 'null' ? null : req.params.contractNumber,
        meterNumber: req.params.meterNumber == 'null' ? null : req.params.meterNumber
      },
      type: QueryTypes.SELECT
    }
  ).then(data => {
    let consumptionMonth = [];
    let items = [];
    let month;
    let consumptions;

    if( data.length != 0 ){
      data.forEach(d =>{
        month = getMonth(d.month);
        items.push({
          name: d.date,
          value: parseInt(d.Value, 10)
        });
      });
      consumptions = {
        name: month,
        series: items
      };

      consumptionMonth.push(consumptions);

    }else{
      let d =  new Date();
      let date = getCurrentDate();
      
      let monthParam = d.getMonth() + 1; 
      let numberMonth = monthParam < 10 ? "0" + monthParam : monthParam + "";
      month = getMonth(numberMonth);
      consumptions ={
        name: month,
        series: [{
          name: date,
          value: 0
        }]
      };
      consumptionMonth.push(consumptions);
    }
    res.send(consumptionMonth);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contract."
      });
    });
}

exports.consumptionsByMonth = async (req, res) => {
  const userId = req.userId;
  const monthParam = req.params.month;

  await sequelize.query(
    "SELECT " 
    + "FORMAT(consumption.[Date],'MM') AS month, "
    + "convert(VARCHAR, consumption.[Date], 23) AS date, "
    + "Value AS value "
    + "FROM [WaterSpy].[dbo].[Consumption] AS consumption " 
      + "INNER JOIN [WaterSpy].[dbo].[Meter] AS meter "
        + "ON consumption.MeterId = meter.Id "
      + "INNER JOIN [WaterSpy].[dbo].[Contract] AS contract "
        + "ON meter.ContractId = contract.Id "
      + "INNER JOIN [WaterSpy].[dbo].[UserContract] AS userContract "
        + "ON contract.Id = userContract.ContractId "
    + "WHERE "
      + "userContract.UserId = :userId "
    + "AND "
      + "(contract.contractNumber = :contractNumber OR :contractNumber IS NULL) "
    + "AND "
      +"(meter.meterNumber = :meterNumber OR :meterNumber IS NULL) "
    + "AND " 
      + "DATEPART(mm,consumption.[Date]) = :month "
    + "AND "
      + "DATEPART(YYYY,consumption.[Date]) = DATEPART(YYYY,GETDATE())",
    {
      replacements: {
        userId: userId,
        month: monthParam,
        contractNumber: req.params.contractNumber == 'null' ? null : req.params.contractNumber,
        meterNumber: req.params.meterNumber == 'null' ? null : req.params.meterNumber
      },
      type: QueryTypes.SELECT
    }
  ).then(data => {
    let consumptionMonth = [];
    let items = [];
    let month;
    let consumptions;

    if( data.length != 0 ){
      data.forEach(d =>{
        month = getMonth(d.month);
        items.push({
          name: d.date,
          value: parseInt(d.value, 10)
        });
      });
      consumptions = {
        name: month,
        series: items
      };

      consumptionMonth.push(consumptions);

    }else{
      let date = getCurrentDate();
      let numberMonth = monthParam < 10 ? "0" + monthParam : monthParam + "";
      month = getMonth(numberMonth);
      consumptions ={
        name: month,
        series: [{
          name: date,
          value: 0
        }]
      };
      consumptionMonth.push(consumptions);
    }
    res.send(consumptionMonth);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contract."
      });
    });
}

function translateMonth(data){
  data.forEach(e => {
    e.month = getMonth(e.month); 
  });
  return data;
}

function getMonth(numberOfMonth){
  switch (numberOfMonth) {
    case "01":
      numberOfMonth = "Janeiro"
      break;
    case "02":
      numberOfMonth = "Fevereiro"
      break;
    case "03":
      numberOfMonth = "Março"
      break;
    case "04":
      numberOfMonth = "Abril"
      break;
    case "05":
      numberOfMonth = "Maio"
      break;
    case "06":
      numberOfMonth = "Junho"
      break;
    case "07":
      numberOfMonth = "Julho"
      break;
    case "08":
      numberOfMonth = "Agosto"
      break;
    case "09":
      numberOfMonth = "Setembro"
      break;
    case "10":
      numberOfMonth = "Outubro"
      break;
    case "11":
      numberOfMonth = "Novembro"
      break;
    case "12":
      numberOfMonth = "Dezembro"
      break;
    default:
      break;
  }
  return numberOfMonth
}

function getCurrentDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}