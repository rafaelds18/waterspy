module.exports = (sequelize, Sequelize) => {
    const Contract = sequelize.define("Contract", {
      contractNumber: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      supplierId: {
        type: Sequelize.INTEGER
      },
      deleted: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Contract;
  };