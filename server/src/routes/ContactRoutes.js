import express from "express";

import * as contactController from "../controllers/contactController.js";
import verifyJwt from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.route("/displayContacts").get(verifyJwt, contactController.getContacts);
router.route("/add-friend").post(verifyJwt, contactController.addFriend);
router.route("/create-friend-group").post(verifyJwt, contactController.createFriendGroup);
router.route("/display-friend-connections").get(verifyJwt, contactController.getConnections);
router.route("/delete-friend").delete(verifyJwt, contactController.deleteContact);
export default router;
