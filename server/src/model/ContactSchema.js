const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: "User", // Reference to User model
    required: true,
  },
  contactId: {
    //     type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: "User", // Reference to User model
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Contact',contactSchema)
