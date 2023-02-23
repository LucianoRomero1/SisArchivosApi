const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/profile/:id", check.auth, UserController.profile);

module.exports = router;
