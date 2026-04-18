import express from "express";

import * as messageController from "../controllers/messageController.js";
import verifyJwt from "../middlewares/authMiddleware.js";

const router = express.Router();

//send message
router.route("/send-message/:id").post(verifyJwt, messageController.sendMessage);
router.route("/get-messages/:id").get(verifyJwt, messageController.getMessage);
router.route("/edit-message/:id").put(verifyJwt, messageController.editMessage);
router.route("/delete-message/:id").delete(verifyJwt, messageController.deleteMessage);

export default router;
