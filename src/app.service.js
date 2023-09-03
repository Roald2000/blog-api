const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const { sequelize } = require("./app.dbconfig");
const { DataTypes } = require("sequelize");
const { uniq_id } = require("./app.helper");

const secret_key = process.env.secret_key;
const secret_key_life = process.env.secret_key_life;

const BlackList = sequelize.define(
  "blacklist",
  {
    t_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: uniq_id,
    },
    blacklisted_token: {
      type: DataTypes.TEXT("long"),
      unique: true,
    },
  },
  { tableName: "blacklist", freezeTableName: true, timestamps: true }
);

function verifyToken(token) {
  try {
    if (!token) {
      throw createHttpError.Forbidden(`Invalid token, ${token}`);
    } else {
      const verified = jwt.verify(token, secret_key);
      if (verified.exp < Date.now() / 1000) {
        throw createHttpError.Forbidden("Invalid token, expired");
      } else {
        return verified.user;
      }
    }
  } catch (error) {
    throw error;
  }
}

function generateToken(payload) {
  try {
    return jwt.sign({ user: payload }, secret_key ?? "secret-key", {
      expiresIn: secret_key_life ?? "1 day",
    });
  } catch (error) {
    throw error;
  }
}
const Service = {
  JWT: {
    generateToken: (payload) => generateToken(payload),
    verifyToken: (token) => verifyToken(token),
    authMiddleWare: async function (req, res, next) {
      try {
        let token = req.headers.authorization;
        if (!token) {
          throw createHttpError.Forbidden(`Invalid token, ${token}`);
        } else {
          token =
            token.split(" ")[0] === "Bearer" ? token.split(" ")[1] : token;

          const isBlacklisted = await BlackList.findOne({
            where: { blacklisted_token: token },
          });

          if (isBlacklisted ?? isBlacklisted?.dataValues) {
            throw createHttpError.Forbidden("Invalid token, access denied");
          } else {
            req.user = verifyToken(token);
            next();
          }
        }
      } catch (error) {
        next(error);
      }
    },
  },
  // Other: {}
};

module.exports = {
  ...Service,
  BlackList,
};
