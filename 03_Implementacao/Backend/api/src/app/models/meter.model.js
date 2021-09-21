module.exports = (sequelize, Sequelize) => {
    const Meter = sequelize.define("Meter", {
      meterNumber: {
        type: Sequelize.INTEGER
      },
      contractId: {
        type: Sequelize.INTEGER
      },
      deleted: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Meter;
  };