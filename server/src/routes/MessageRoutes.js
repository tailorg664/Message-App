const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");
router.route("/").post(verifyJwt,messageController.sendMessage);
module.exports = router;