const db = require("../../app/models");
const Notification = db.Notification;
const Supplier = db.Supplier;
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const nodemailer = require("../../app/services/nodemailer.services.js");

exports.getNotifications = async (req, res) => {
    const userId = req.userId;
    let notifications = [];

    await sequelize.query(
      'SELECT ntf.Content, ntf.Date, ntf.NotificationType, sp.Name FROM Notification AS ntf INNER JOIN Supplier AS sp ON ntf.supplierId = sp.Id WHERE userId = :userId',
      {
        replacements: {
          userId: userId
        },
        type: QueryTypes.SELECT
      }
    ).then(data => {
      data.forEach( d => {
        let notification = {
          content: d.Content,
          date: d.Date,
          notificationType: d.NotificationType,
          supplierName: d.Name
        };    
        notifications.push(notification);
      });
      res.send(notifications);
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving notification."
        });
      });

    function setNotifications(data){
      return new Promise((resolve, reject) => {
        data.forEach( async d => {
          let supplierId = d.SupplierId;
          let notification = {
            content: d.Content,
            date: d.Date,
            notificationType: d.NotificationType,
          };
          await Supplier.findByPk(supplierId).then(supplier => {
            notification.Supplier = supplier.name;    
            notifications.push(notification);
          });
        });
        resolve(data);
      });
      
    }
      
  };

  /**
 * Send mensage for client
 */
exports.sendNotification = async (req, res) => {
  let user = req.body.user;
  let contract = req.body.contract;
  let subject = req.body.subject;
  let message = req.body.message;

  try {
      await Notification.create({
          userId: user.id,
          supplierId: contract.supplierId,
          content: message,
          date: db.Sequelize.fn('GETDATE'),
          notificationType: "SENDING_INFO"
      }).then(()=>{
          nodemailer.sendEmail(user.email, subject, message);
          res.status(200).send();
      });
      
  } catch (error) {
      res.status(500).send({
          message:
          error.message
      });
  }
};