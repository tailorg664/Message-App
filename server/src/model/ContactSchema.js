const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Contact", contactSchema);
