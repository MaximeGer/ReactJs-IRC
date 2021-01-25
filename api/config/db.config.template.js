module.exports = {
    HOST: "localhost",
    USER: "USER_DB",
    PASSWORD: "PASSWORD_DB",
    DB: "DB_NAME",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };