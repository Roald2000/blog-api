const { DataTypes } = require("sequelize");
const { sequelize } = require("../app.dbconfig");

const { uniq_id } = require("../app.helper");
const { users } = require("./model.user");

const blogs = sequelize.define(
  "blogs",
  {
    blog_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
      defaultValue: uniq_id,
    },
    author: {
      type: DataTypes.STRING(64),
      unique: false,
      allowNull: false,
      references: { model: users, key: "username" },
    },
    blog_text: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null,
    },
    blog_file_path: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null,
    },
    blog_file: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
      defaultValue: null,
    },
    blog_status: {
      type: DataTypes.ENUM(["Public", "Private"]),
      defaultValue: "Public",
      allowNull: false,
    },
  },
  {
    tableName: "blogs",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = { blogs };
