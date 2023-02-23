const express = require("express");
const router = express.Router();

const SideController = require("../controllers/side");
const check = require("../middlewares/auth");

router.post("/create", check.auth, SideController.create);
router.get("/list/:page?/:size?", check.auth, SideController.list);
router.get("/detail/:id", check.auth, SideController.detail);
router.put("/update/:id", check.auth, SideController.update);
router.delete("/remove/:id", check.auth, SideController.remove);

module.exports = router;
