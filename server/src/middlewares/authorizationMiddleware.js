import Conversation from "../model/ConversationSchema.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const canEditGroupInfo = asyncHandler(async (req, _res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = req.group ?? (await Conversation.findById(groupId).lean());

  if (!group) {
    throw new ApiError(404, "Group not found or you are not a participant");
  }

  const participant = group.participants.find(
    (p) => p.user.toString() === userId.toString(),
  );

  if (!participant) {
    throw new ApiError(403, "You are not a participant of this group");
  }

  if (participant.role === "admin") {
    return next();
  }

  if (group.groupMetadata.settings.membersCanEditInfo) {
    return next();
  }

  throw new ApiError(403, "Only admins can change group info.");
});

export default canEditGroupInfo;
