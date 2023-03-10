const express = require("express");
const router = express.Router();

const AreaController = require("../controllers/area");
const check = require("../middlewares/auth");

router.post("/create", check.auth, AreaController.create);
router.get("/list/:page?/:size?", check.auth, AreaController.list);
router.get("/detail/:id", check.auth, AreaController.detail);
router.put("/update/:id", check.auth, AreaController.update);
router.delete("/remove/:id", check.auth, AreaController.remove);
router.get("/getAll", check.auth, AreaController.getAll);

module.exports = router;
