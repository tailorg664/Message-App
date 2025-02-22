const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  primaryUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  secondaryUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Contact", contactSchema);
// fullname: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },