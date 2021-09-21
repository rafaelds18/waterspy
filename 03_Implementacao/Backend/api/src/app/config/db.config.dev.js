module.exports = {
    HOST: "localhost",
    USER: "sa",
    PASSWORD: "P@55w0rd",
    DB: "WaterSpy",
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };