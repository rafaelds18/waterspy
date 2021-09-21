module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
      description: {
        type: Sequelize.STRING
      }
    });
  
    return Role;
  };