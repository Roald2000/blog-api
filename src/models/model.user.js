const { sequelize } = require("../app.dbconfig");

const { DataTypes } = require("sequelize");
const { uniq_id } = require("../app.helper");

const users = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.STRING(70),
      primaryKey: true,
      defaultValue: uniq_id,
    },
    username: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    user_role: {
      type: DataTypes.ENUM(["User", "Admin"]),
      defaultValue: "User",
      allowNull: false,
    },
    user_status: {
      type: DataTypes.ENUM(["Active", "Inactive"]),
      defaultValue: "Active",
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = { users };
