const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
// const check = require("../middlewares/auth");

router.get("/test", UserController.test);
router.post("/register", UserController.register);

module.exports = router;