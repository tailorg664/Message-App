import Conversation from "../model/ConversationSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const requireGroup = asyncHandler(async (req, _res, next) => {
  const { groupId } = req.params;

  if (!groupId) {
    throw new ApiError(404, "invalid group entry");
  }

  const group = await Conversation.findById(groupId).lean();

  if (!group) {
    throw new ApiError(404, "Group not found or you are not a participant");
  }

  if (group.connectionType !== "group") {
    throw new ApiError(400, "The specified contact is not a group");
  }

  req.group = group;
  next();
});

export default requireGroup;
