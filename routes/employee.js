const express = require("express");
const router = express.Router();

const EmployeeController = require("../controllers/employee");
const check = require("../middlewares/auth");

router.post("/create", check.auth, EmployeeController.create);
router.get("/list/:page?/:size?", check.auth, EmployeeController.list);
router.get("/detail/:id", check.auth, EmployeeController.detail);
router.put("/update/:id", check.auth, EmployeeController.update);
router.delete("/remove/:id", check.auth, EmployeeController.remove);
router.get("/getAll", check.auth, EmployeeController.getAll);


module.exports = router;
