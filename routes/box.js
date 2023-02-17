const express = require("express");
const router = express.Router();

const BoxController = require("../controllers/box");
const check = require("../middlewares/auth");

router.get("/test", check.auth, BoxController.test);
router.post("/create", check.auth, BoxController.create);

module.exports = router;
