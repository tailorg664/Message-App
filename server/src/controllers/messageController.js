import Message from "../model/MessageSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { getRecieverSocketId, io } from "../utils/socket.js";
import cloudinary from "../utils/cloudinary.js";

const sendMessage = asyncHandler(async (req, res) => {
  const sender = req.user.id;
  const { image, content } = req.body;
  const { id: reciever } = req.params;

  if (!sender || !reciever) {
    throw new ApiError(404, "sender or reciever doesnot exists.");
  }

  let imageURL;

  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageURL = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    sender,
    reciever,
    content,
    image: imageURL,
  });

  await newMessage.save();

  const recieverSocketId = getRecieverSocketId(reciever);

  if (recieverSocketId) {
    io.to(recieverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(new ApiResponse(201, newMessage, "Message sent"));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.body;

  if (!messageId) {
    throw new ApiError(400, "Message doesnot exist or already deleted.");
  }

  await Message.findByIdAndDelete(messageId);

  return res.status(200).json(new ApiResponse(200, {}, "Message Deleted"));
});

const getMessage = asyncHandler(async (req, res) => {
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

  res.status(200).json(new ApiResponse(200, message, "Messages found"));
});

export { sendMessage, deleteMessage, getMessage };
