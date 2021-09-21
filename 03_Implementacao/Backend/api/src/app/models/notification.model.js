module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
        userId: {
            type: Sequelize.INTEGER
        },
        supplierId: {
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        notificationType: {
            type: Sequelize.STRING
        }
    });
  
    return Notification;
  };