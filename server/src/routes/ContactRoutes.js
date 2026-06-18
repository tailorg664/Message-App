import express from "express";

import * as contactController from "../controllers/contactController.js";
import verifyJwt from "../middlewares/authMiddleware.js";
import canEditGroupInfo from "../middlewares/authorizationMiddleware.js";
import requireGroup from "../middlewares/groupMiddleware.js";
const router = express.Router();

router
  .route("/add-friend")
  .post(verifyJwt, contactController.addFriend);
router
  .route("/create-friend-group")
  .post(verifyJwt, contactController.createFriendGroup);
router
  .route("/display-friend-connections")
  .get(verifyJwt, contactController.getConnections);
router
  .route("/delete-friend/:contactId")
  .delete(verifyJwt, contactController.deleteContact);
router
  .route("/group-access/:groupId")
  .put(verifyJwt, requireGroup, contactController.adminAccessControl);
router
  .route("/update-group-metadata/:groupId")
  .put(
    verifyJwt,
    requireGroup,
    canEditGroupInfo,
    contactController.updateGroupMetaData,
  );
router
  .route("/update-group-icon/:groupId")
  .put(
    verifyJwt,
    requireGroup,
    canEditGroupInfo,
    contactController.updateGroupIcon,
  );
router
  .route("/exit-group/:groupId")
  .delete(verifyJwt, requireGroup, contactController.exitGroup);
export default router;
