const { createResponse } = require("./app.helper");
const { JWT } = require("./app.service");

const router = require("express").Router();

router.use("/user", require("./routes/route.user"));

router.use("/blogs", JWT.authMiddleWare, require("./routes/route.blogs"));

router.get("/test-auth", JWT.authMiddleWare, (req, res, next) => {
  createResponse(res, 200, { ...req.user });
});

module.exports = router;
