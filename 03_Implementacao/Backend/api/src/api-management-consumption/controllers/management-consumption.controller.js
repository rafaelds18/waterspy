const db = require("../../app/models");
const Notification = db.Notification;
const nodemailer = require("../../app/services/nodemailer.services.js");
var jsonData = require('../../app/assets/i18n/pt.json');

/**
 * Send mensage for client tell you, the entity receive him consumption value 
 * @param {*} value 
 * @param {*} supplierId 
 * @param {*} userId 
 * @param {*} email 
 */
exports.receiveReadingResponse = async (value, contract, meter, userId, email) => {
    let desc = " Para o " + contract.description + " - " + contract.contractNumber + ", com o contador " + meter.meterNumber + 
                ", com o valor de " + value + " m³";
    try {
        await Notification.create({
            userId: userId,
            supplierId: contract.supplierId,
            content: jsonData.NOTIFICATIONS.EMAIL.TEXT.RECEIVE_CONSUMPTION + desc,
            date: db.Sequelize.fn('GETDATE'),
            notificationType: "READING_CONSUMPTION"
        }).then(()=>{
            let to = email;
            let subject = jsonData.NOTIFICATIONS.EMAIL.SUBJECT;
            let text = jsonData.NOTIFICATIONS.EMAIL.TEXT.RECEIVE_CONSUMPTION + desc;
            nodemailer.sendEmail(to, subject, text);
        });
        
    } catch (error) {
        res.status(500).send({
            message:
            error.message
        });
    }
};

/**
 * 
 * @param {*} value 
 * @param {*} supplierId 
 * @param {*} userId 
 * @param {*} email 
 */
exports.sendBill = async (value, supplierId, userId, email) => {

    let randNum = genRand(10, 100, 2);
    let content = "Este mês fez um total de " + value + "m³. " + jsonData.NOTIFICATIONS.EMAIL.TEXT.SEND_BILLING + randNum;
    to = email;
    subject = jsonData.NOTIFICATIONS.EMAIL.SUBJECT;
    text = content;
    try {
        await Notification.create({
            userId: userId,
            supplierId: supplierId,
            content: content,
            date: db.Sequelize.fn('GETDATE'),
            notificationType: "SEND_BILL"
        }).then(data => {        
            nodemailer.sendEmail(to, subject, text);
        })
    } catch (error) {
        res.status(500).send({
            message:
            error.message
          });
    }
}

function genRand(min, max, decimalPlaces) {  
    var rand = Math.random()*(max-min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand*power) / power;
}