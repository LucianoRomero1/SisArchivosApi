const express = require("express");
const router = express.Router();

const FolderController = require("../controllers/folder");
const check = require("../middlewares/auth");

router.get("/test", check.auth, FolderController.test);
router.post("/create", check.auth, FolderController.create);
router.get("/list/:page?/:size?", check.auth, FolderController.list);
router.get("/detail/:id", check.auth, FolderController.detail);
router.put("/update/:id", check.auth, FolderController.update);
router.delete("/remove/:id", check.auth, FolderController.remove);

module.exports = router;
