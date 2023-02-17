const express = require("express");
const router = express.Router();

const BoxController = require("../controllers/box");
const check = require("../middlewares/auth");

router.get("/test", check.auth, BoxController.test);
router.post("/create", check.auth, BoxController.create);
router.get("/list/:page?/:size?", check.auth, BoxController.list);
router.get("/detail/:id", check.auth, BoxController.detail);
router.put("/update/:id", check.auth, BoxController.update);
router.delete("/remove/:id", check.auth, BoxController.remove);

module.exports = router;
