const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.database ?? "blog_db",
  process.env.user ?? "root",
  process.env.password ?? "",
  {
    host: process.env.host ?? "localhost",
    port: process.env.port ?? 3306,
    dialect: "mysql",
    logging: false,
  }
);

//  where: Sequlize.literal("CONCAT(col,col) LIKE %search%")
// sequelize.sync({ alter: true });

module.exports = {
  sequelize,
};
