const Message = require("../model/MessageSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const sendNotification = require("../utils/Notifications");
exports.sendMessage = asyncHandler(async (req, res) => {
  const sender = req.user.id;
  const { reciever, content } = req.body;
  if (!sender || !reciever) {
    throw new ApiError(404, "sender or reciever doesnot exists.");
  }

  // Create a new message
  const message = new Message({
    sender,
    reciever,
    content,
  });
  const savedMessage = await message.save();
  sendNotification(reciever, savedMessage);
  res.status(201).json(new ApiResponse(201, "Message sent", message));
});
exports.deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.body;
  if (!messageId) {
    throw new ApiError(400, "Message doesnot exist or already deleted.");
  }
  await Message.findByIdAndDelete(messageId);

  return res.status(200).json(new ApiResponse(200, {}, "Message Deleted"));
});
exports.getMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  const { id: userToChatId } = req.params;
  if (!userToChatId) {
    throw new ApiError(404, "User to chat not found");
  }
  const message = await Message.find({
    $or: [
      { sender: userId, reciever: userToChatId },
      { sender: userToChatId, reciever: userId },
    ],
  });
  if (!message) {
    throw new ApiError(404, "No messages found");
  }
  res.status(200).json(new ApiResponse(200, "Messages found", message));
});
