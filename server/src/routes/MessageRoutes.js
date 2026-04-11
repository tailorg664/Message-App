import express from "express";

import * as messageController from "../controllers/messageController.js";
import verifyJwt from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/send/:id").post(verifyJwt, messageController.sendMessage);
router.route("/getMessages/:id").get(verifyJwt, messageController.getMessage);
router.route("/delete").delete(verifyJwt, messageController.deleteMessage);

export default router;
