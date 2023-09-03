const router = require("express").Router();

const controllerBlogs = require("../controllers/controller.blogs");

router.post("/new-blog", controllerBlogs.createBlog);

router.put("/update-blog-p/:blog_id", controllerBlogs.updateBlog);
router.put("/update-blog-q", controllerBlogs.updateBlog);

router.delete("/delete-blog-p/:blog_id", controllerBlogs.deleteBlog);
router.delete("/delete-blog-q", controllerBlogs.deleteBlog);

router.get("/", controllerBlogs.getBlogs);

router.get("/:status", controllerBlogs.getBlogByStatus);

router.get("/pagination", controllerBlogs.getBlogByPagination);

// router.get(
//   "/pagination_param/:p_page/:p_limit/:p_order/:p_sort",
//   controllerBlogs.getBlogByPagination
// );

module.exports = router;
