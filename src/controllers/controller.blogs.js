const createHttpError = require("http-errors");
const { createResponse } = require("../app.helper");
const { blogs } = require("../models/model.blogs");
const { users } = require("../models/model.user");

module.exports = {
  createBlog: async function (req, res, next) {
    try {
      const { username, user_id } = req.user; // User credentials based on token payload
      const { blog_text, blog_file_path, blog_file, blog_status } = req.body;

      (await blogs.create({
        author: username,
        blog_text: blog_text,
        blog_file_path: blog_file_path,
        blog_file: blog_file,
        blog_status: blog_status,
      })) && createResponse(res, 201);
    } catch (error) {
      next(error);
    }
  },

  updateBlog: async function (req, res, next) {
    try {
      const { username } = req.user; // author
      const keyFilters = {
        where: {
          blog_id: req.params.blog_id ?? req.query.blog_id,
          author: username,
        },
      };
      const isUpdated = await blogs.update({ ...req.body }, { ...keyFilters });
      isUpdated && createResponse(res, 201);
    } catch (error) {
      next(err);
    }
  },

  deleteBlog: async function (req, res, next) {
    try {
      await blogs.destroy({
        where: { blog_id: req.params.blog_id ?? req.query.blog_id },
      });
      createResponse(res, 204);
    } catch (error) {
      next(error);
    }
  },

  getBlogs: async function (req, res, next) {
    try {
      // blogs.belongsTo(users, { foreignKey: "author", targetKey: "username" });
      const result = await blogs.findAll({
        where: { blog_status: "Public" },
        limit: 100,
        // include: users,
      });

      // result.forEach((content) => {
      //   let { password } = content.user;
      //   delete password;
      // });

      if (result.length === 0) {
        throw createHttpError.NotFound("No blogs were found");
      } else {
        createResponse(res, 200, { data: result });
      }
    } catch (error) {
      next(error);
    }
  },

  getBlogByStatus: async function (req, res, next) {
    try {
      const { status } = req.params;
      const result = await blogs.findAndCountAll({
        where: { blog_status: status },
        order: [["blog_status", "DESC"]],
      });
      if (result.rows.length === 0) {
        throw createHttpError.NotFound("No blogs were found");
      } else {
        createResponse(res, 200, { data: result });
      }
    } catch (error) {
      next(error);
    }
  },

  getBlogByPagination: async function (req, res, next) {
    try {
      let query = {};
      if (!req.query) {
        let {
          p_page = 1,
          p_limit = 30,
          p_order = "blog_id",
          p_sort = "asc",
        } = req.params;
        query = {
          page: (+p_page - 1) * +p_limit,
          limit: +p_limit ?? 1,
          order: [[p_order, p_sort]],
        };
      } else {
        let {
          q_page = 1,
          q_limit = 30,
          q_order = "blog_id",
          q_sort = "asc",
        } = req.query;
        query = {
          page: (+q_page - 1) * +q_limit,
          limit: +q_limit ?? 1,
          order: [[q_order, q_sort]],
        };
      }

      const result = await blogs.findAll({ ...query });

      if (result.length === 0) {
        throw createHttpError.NotFound("No blogs found");
      } else {
        createResponse(res, 200, { data: result });
      }
    } catch (error) {
      next(error);
    }
  },
};
