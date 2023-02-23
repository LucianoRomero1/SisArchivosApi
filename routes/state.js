const express = require("express");
const router = express.Router();

const StateController = require("../controllers/state");
const check = require("../middlewares/auth");

router.post("/create", check.auth, StateController.create);
router.get("/list/:page?/:size?", check.auth, StateController.list);
router.get("/detail/:id", check.auth, StateController.detail);
router.put("/update/:id", check.auth, StateController.update);
router.delete("/remove/:id", check.auth, StateController.remove);

module.exports = router;
