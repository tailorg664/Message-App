const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJwt = require("../middlewares/authMiddleware");
router.route("/signup").get(userController.createUser);
router.route("/login").get(userController.loginUser);
router.route("/logout").post(verifyJwt, userController.logoutUser);
module.exports = router;