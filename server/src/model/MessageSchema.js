const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachmentUrl: {
      type: String, // For media files or attachments
      default: null,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"], // Message status
      default: "sent",
    },
    isGroupMessage: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference to Group model for group messages
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
