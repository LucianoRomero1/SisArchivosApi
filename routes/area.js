const express = require("express");
const router = express.Router();

const AreaController = require("../controllers/area");
const check = require("../middlewares/auth");

router.get("/test", check.auth, AreaController.test);
router.post("/create", check.auth, AreaController.create);

module.exports = router;
