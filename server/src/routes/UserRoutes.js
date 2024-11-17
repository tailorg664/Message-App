const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/signup").get(userController.createUser);
router.route("/login").get(userController.loginUser);
router.route("/logout").get(userController.logoutUser);
module.exports = router;
