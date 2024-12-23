const express = require("express");
const router = express.Router();
const verifyJwt = require("../middlewares/authMiddleware");
const contactController = require("../controllers/contactController");
//route definition
router.route("/displayContacts").get(contactController.getContacts);
router.route("/addContact").get(contactController.addContact);
//routes described
module.exports = router;
