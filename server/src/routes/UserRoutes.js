const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJwt = require("../middlewares/authMiddleware");
router.route("/signup").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(verifyJwt, userController.logoutUser);
router.route("/update-profile").put(verifyJwt, userController.updateProfile);
// auth route
router.route("/check").get(verifyJwt, userController.checkAuth);
module.exports = router;
