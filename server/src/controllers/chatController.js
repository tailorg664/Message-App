const Chat = require("../model/ChatSchema");
const User = require("../model/UserSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

exports.createChat = asyncHandler(async (req, res) => {
  const { participants } = req.body;
  if (!participants || participants.length < 2) {
    throw new ApiError(
      400,
      "Participants are required and should be more than 1"
    );
  }
  let chat = await Chat.findOne({
    participants: { $all: participants },
  });
  if (chat) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Chat already exists", chat));
  }
  chat = new Chat({ participants });
  await chat.save();
  res.status(201).json(new ApiResponse(201, "Chat created", chat));
});
exports.getChatsForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // finding whether the user exists
  if (!userId) {
    throw new ApiError(400, "User not found");
  }
  // finding the chats for the user
  const chats = await Chat.find({ participants: userId })
    .populate("participants", "fullname username email")
    .populate("lastMessage", "content timestamps").sort({ lastUpdated: -1 });
  res.status(200).json(new ApiResponse(200, "Chats fetched for user", chats));
});
exports.deleteChat = asyncHandler(async (req, res) => {
      const chatId = req.params.id;
})