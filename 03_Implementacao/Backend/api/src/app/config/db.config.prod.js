module.exports = {
    HOST: "waterspy.mssql.somee.com",
    USER: "waterspy_db",
    PASSWORD: "waterspyleim",
    DB: "waterspy",
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };