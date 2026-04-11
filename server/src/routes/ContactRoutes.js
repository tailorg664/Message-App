import express from "express";

import * as contactController from "../controllers/contactController.js";
import verifyJwt from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/displayContacts").get(verifyJwt, contactController.getContacts);
router.route("/addContact").post(contactController.addContact);

export default router;
