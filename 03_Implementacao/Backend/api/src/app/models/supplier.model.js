module.exports = (sequelize, Sequelize) => {
    const Supplier = sequelize.define("Supplier", {
      name: {
        type: Sequelize.STRING
      },
      tin: {
        type: Sequelize.INTEGER
      },
      deleted: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Supplier;
  };