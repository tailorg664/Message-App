import express from "express";

import * as userController from "../controllers/userController.js";
import verifyJwt from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/checker").get(userController.checker);
router.route("/signup").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(verifyJwt, userController.logoutUser);
router.route("/update-profile").put(verifyJwt, userController.updateProfile);
router.route("/check").get(verifyJwt, userController.checkAuth);

export default router;
