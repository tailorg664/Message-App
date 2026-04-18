import Message from "../model/MessageSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";

const getCloudinaryPublicIdFromUrl = (url) => {
  if (!url) {
    return null;
  }

  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return null;
  }

  const assetPath = url.slice(uploadIndex + uploadMarker.length);
  const normalizedPath = assetPath.replace(/^v\d+\//, "");

  return normalizedPath.replace(/\.[^/.]+$/, "");
};

const sendMessage = asyncHandler(async (req, res) => {
  try {
    //getting inputs
    const sender = req.user.id;
    const conversationId = req.params.id;
    const { content, image } = req.body;
    const trimmedContent = content?.trim() || "";
    //error handling
    if (!sender || !conversationId) {
      throw new ApiError(404, "sender or conversationId doesnot exists.");
    }

    if (!trimmedContent && !image) {
      throw new ApiError(400, "Message content or image is required.");
    }
    // currently we are allowing one image/message, we can change it to multiple images in future if needed.

    let imageURL;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      imageURL = result.secure_url;
    }

    const newMessage = await Message.create({
      sender,
      conversationId,
      content: imageURL ? imageURL : trimmedContent,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newMessage, "Message sent"));
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: error.message,
      stack: error.stack,
    });
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      throw new ApiError(400, "Message doesnot exist or already deleted.");
    }
    const message = await Message.findById(messageId).lean();

    if (!message) {
      throw new ApiError(404, "Message doesnot exist or already deleted.");
    }

    const imagePublicId = getCloudinaryPublicIdFromUrl(message.content);
    
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    // can be done later
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }

    if (!deletedMessage) {
      throw new ApiError(404, "Message doesnot exist or already deleted.");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Message Deleted"));
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: error.message,
      stack: error.stack,
    });
  }
});

const editMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId, content } = req.body;

    if (!userId || !messageId) {
      throw new ApiError(400, "User or message doesnot exist.");
    }

    if (!content || !content.trim()) {
      throw new ApiError(400, "Message content is required.");
    }

    const message = await Message.findById(messageId);

    if (!message) {
      throw new ApiError(404, "Message doesnot exist or already deleted.");
    }

    if (message.sender.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to edit this message.");
    }

    if (getCloudinaryPublicIdFromUrl(message.content)) {
      throw new ApiError(400, "Image messages cannot be edited.");
    }

    message.content = content.trim();
    await message.save();

    return res
      .status(200)
      .json(new ApiResponse(200, message, "Message updated"));
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: error.message,
      stack: error.stack,
    });
  }
});

const getMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    if (!userId || !conversationId) {
      throw new ApiError(404, "User or conversation not found");
    }

    const messages = await Message.find({ conversationId: conversationId }).sort({
      createdAt: 1,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages found"));
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: error.message,
      stack: error.stack,
    });
  }
});

export { sendMessage, deleteMessage, editMessage, getMessage };
