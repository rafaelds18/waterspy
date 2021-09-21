module.exports = (sequelize, Sequelize) => {
    const Consumption = sequelize.define("Consumption", {
      meterId: {
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  
    return Consumption;
};