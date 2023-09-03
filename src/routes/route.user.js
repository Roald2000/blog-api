const router = require("express").Router();

const controllerUser = require("../controllers/controller.user");

router.post("/login", controllerUser.login);
router.post("/register", controllerUser.register);

module.exports = router;
