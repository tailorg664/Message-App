const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact", // Reference to the Contact model
      },
    ],
    lastSeen: { type: Date },
    token: { type: String },
  },
  { timestamps: true }
);

// Model creation

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    }
  );
};
const User = mongoose.model("User", userSchema);
module.exports = User;
