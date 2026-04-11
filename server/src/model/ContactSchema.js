import mongoose from "mongoose";

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

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
