const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    logging: true,
    dialect: "mysql",
  }
);
try {
  sequelize.authenticate();
  console.log("Successfully database connected !");
} catch (err) {
  console.log("Failed database connected !", err);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./user")(sequelize, DataTypes);
db.Otp = require("./otp")(sequelize, DataTypes);
db.sequelize.sync({ alter: true });
module.exports = db;
