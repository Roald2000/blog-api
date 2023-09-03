const bcryptjs = require("bcryptjs");
const { users } = require("../models/model.user");
const createHttpError = require("http-errors");
const { createResponse } = require("../app.helper");
const { JWT } = require("../app.service");

module.exports = {
  login: async function (req, res, next) {
    try {
      const { username, password } = req.body;

      let findUsername = await users.findOne({
        where: { username: username },
      });

      if (!findUsername) {
        throw createHttpError.NotFound(
          "Invalid Username/Password not registered"
        );
      } else {
        const checkPassword = bcryptjs.compareSync(
          password,
          findUsername?.dataValues.password
        );
        if (!checkPassword) {
          throw createHttpError.BadRequest(
            "Invalid Username/Password not match"
          );
        } else {
          delete findUsername.dataValues.password;

          createResponse(res, 200, {
            message: "Login Success!",
            token: JWT.generateToken(findUsername?.dataValues),
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  register: async function (req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username) {
        throw createHttpError.BadRequest("Invalid Username");
      }
      if (!password) {
        throw createHttpError.BadRequest("Invalid Password");
      }
      const checkUser = await users.findAll({ where: { username: username } });
      if (checkUser.length !== 0) {
        throw createHttpError.Conflict("Invalid Username / Password");
      } else {
        (await users.create({
          username: username,
          password: bcryptjs.hashSync(password, 8),
        })) && createResponse(res, 201, { message: "users Register Success" });
      }
    } catch (error) {
      next(error);
    }
  },
};
