const express = require("express");
const router = express.Router();

const MovementController = require("../controllers/movement");
const check = require("../middlewares/auth");

router.post("/create", check.auth, MovementController.create);
router.get("/list/:page?/:size?", check.auth, MovementController.list);
router.get("/detail/:id", check.auth, MovementController.detail);
router.put("/update/:id", check.auth, MovementController.update);
router.delete("/remove/:id", check.auth, MovementController.remove);
router.get("/getAll", check.auth, MovementController.getAll);

module.exports = router;
