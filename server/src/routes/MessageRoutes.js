const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");
router.route("/send/:id").post(verifyJwt,messageController.sendMessage);
router.route("/getMessages/:id").get(verifyJwt,messageController.getMessage);
router.route("/delete").delete(verifyJwt,messageController.deleteMessage);
module.exports = router;