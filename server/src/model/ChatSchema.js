const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact", // References the Contact model
      required: true,
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    default: "Start chatting!", // Default message to display when chat is created
    ref: "Message", // Reference to the most recent message for quick access
  },
  lastUpdated: {
    type: Date,
    default: Date.now, // Tracks when the chat was last updated
  },
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat
