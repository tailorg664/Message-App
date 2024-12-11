const Message = require("../model/MessageSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
exports.sendMessage = asyncHandler(async (req, res) => {
  const { senderId } = req.user.id;
  const {
    receiverId,
    content,
    attachmentUrl,
    isGroupMessage,
    groupId,
  } = req.body;
  if (!senderId || (!receiverId && !isGroupMessage)) {
    throw new ApiError(400, "senderId and receiverId or groupId is required");
  }
  // Create a new message
  const message = new Message({
    senderId,
    receiverId: isGroupMessage ? null : receiverId,
    content,
    attachmentUrl,
    isGroupMessage,
    groupId,
  });
  await message.save();

  res.status(201).json(new ApiResponse(201, "Message sent", message));
});
