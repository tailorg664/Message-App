const Contact = require("../model/ContactSchema");
const User = require("../model/UserSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

exports.addContact = asyncHandler(async (req, res) => {
  // importing data from the body
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(404, "The contact doesnot exist");
  }
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "userId not found");
  }
  // creating a new contact
  const contact = new Contact({
    fullname,
    email,
  });
  await contact.save();
  // saving the contact to the user
  const user = await User.findByIdAndUpdate(userId, {
    $push: { contacts: contact._id },
  },
  {new: true});
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(201).json(new ApiResponse(201, "Contact added", contact));
});
exports.getContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "invalid user entry");
  }
  const userContacts = await User.findById(userId)
    .populate("contacts")
    .lean();
  if (!userContacts) {
    throw new ApiError(404, "Contacts not found");
  }
  res.json(new ApiResponse(200, "Contacts retrieved", userContacts.contacts));
});
exports.updateContact = asyncHandler(async (req,res) =>{
  
})