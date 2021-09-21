module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      email: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      imageName: {
        type: Sequelize.STRING
      },
      image:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageType: {
        type: Sequelize.STRING
      },
      emailConfirmed: {
        type: Sequelize.BOOLEAN
      },
      deleted: {
        type: Sequelize.BOOLEAN
      },
      createdOn: {
        type: Sequelize.DATE
      },
      createdBy: {
        type: Sequelize.STRING
      },
      updatedOn: {
        type: Sequelize.DATE
      },
      updatedBy: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.INTEGER
      },
    });  
    return User;
  };