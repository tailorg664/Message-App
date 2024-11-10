const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");

router.route("/").get(userController.createUser);

module.exports = router;
