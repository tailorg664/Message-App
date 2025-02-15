const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact", // References the User model
    required: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact", // References the User model
    required: true,
  },
  content: {
    type: String, // The actual message text
  },
  image: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now, // When the message was sent
  },
  isRead: {
    type: Boolean,
    default: false, // Tracks whether the message was read
  },
});
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
