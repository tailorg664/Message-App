const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");
router.route("/send").post(verifyJwt,messageController.sendMessage);
router.route("/get/:id").get(verifyJwt,messageController.getMessage);
router.route("/delete").delete(verifyJwt,messageController.deleteMessage);
module.exports = router;