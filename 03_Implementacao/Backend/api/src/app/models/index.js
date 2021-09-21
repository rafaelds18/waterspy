
const env = process.env.NODE_ENV || 'dev';
const dbConfig = require(`../config/db.config.${env.trim()}.js`);

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false,
    freezeTableName: true
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Consumption = require("./consumption.model.js")(sequelize, Sequelize);
db.Contract = require("./contract.model.js")(sequelize, Sequelize);
db.Meter = require("./meter.model.js")(sequelize, Sequelize);
db.Notification = require("./notification.model.js")(sequelize, Sequelize);
db.Role = require("./role.model.js")(sequelize, Sequelize);
db.Supplier = require("./supplier.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.UserRole = require("./user-role.model.js")(sequelize, Sequelize);
db.UserContract = require("./user-contract.model.js")(sequelize, Sequelize);

db.Contract.belongsTo(db.Supplier, {
  foreignKey: 'supplierId',
  targetKey: 'id',
  as: 'supplier'
});

db.User.belongsToMany(db.Role, { through: db.UserRole, as: 'roles' });
db.Role.belongsToMany(db.User, { through: db.UserRole });

db.User.belongsToMany(db.Contract, { through: db.UserContract, as: 'contracts' });
db.Contract.belongsToMany(db.User, { through: db.UserContract, as: 'users' });

db.ROLES = ['Admin', 'Consumer'];

module.exports = db;