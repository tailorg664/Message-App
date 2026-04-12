import express from "express";

import * as contactController from "../controllers/contactController.js";
import verifyJwt from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.route("/displayContacts").get(verifyJwt, contactController.getContacts);
router.route("/addFriend").post(verifyJwt, contactController.addFriend);
router.route("/createFriendGroup").post(verifyJwt, contactController.createFriendGroup);

export default router;
