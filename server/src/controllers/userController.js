const User = require("../model/UserSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../utils/cloudinary.js");
// Function to create refresh and access token
const createToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = user.generateToken(userId);
    user.token = token;
    await user.save({ validateBeforeSave: false });
    return token;
  } catch (error) {
    console.log(error);
  }
};
// Controllers
exports.createUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // Create a new user
  const newUser = new User({
    fullname,
    email,
    password,
  });
  await newUser.save();
  if (!newUser) {
    return res.status(400).send("Please fill all the fields");
  }
  const token = await createToken(newUser._id);
  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(201)
    .cookie("jwt", token, options)
    .json(new ApiResponse(201, newUser, "User registered Successfully"));
});
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if the email is provided
  if (!email) {
    throw new ApiError(400, "Email is required for loging user!");
  }
  const user = await User.findOne({ email });
  //check if the user exists
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // Compare input password with hashed password in the database
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");
  //token generation by calling the function createRefreshAndAccessToken
  const token = await createToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -Token"
  );
  console.log(loggedInUser);

  const options = {
    httponly: true,
    secure: false,
  };
  return res
    .status(200)
    .cookie("jwt", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token,
        },
        "Login successful"
      )
    );
});
exports.logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  if (!req.user || !req.user._id) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is missing from the request"));
  }

  const userId = req.user._id.toString().replace(/^String\("(.*)"\)$/, "$1");
  const user = await User.findByIdAndUpdate(userId, { token: undefined});
  if(!user){
    throw new ApiError(400, "User not found");
  }
  const options = {
    httponly: true,
    secure: false,
  };
  return res
    .status(200)
    .clearCookie("jwt", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});
exports.checkAuth = asyncHandler(async (req, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, req.user, "User is authenticated"));
  } catch (error) {
    console.log("Error in checkAuth", error.message);
    throw new ApiError(401, "User is not authenticated");
  }
});
exports.updateProfile = asyncHandler(async (req, res) => {
  try{
    const {avatar} = req.body;
    const userId = req.user._id
    if(!avatar){
      throw new ApiError(400, "Please provide a profile picture")
    }
    const uploadResponse = await cloudinary.uploader.upload(avatar)
    const updatedUser = await User.findByIdAndUpdate(userId, {avatar: uploadResponse.secure_url}, {new: true})

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile picture updated successfully"))
  }catch(error){
    console.log("Error in updateProfile", error.message)
    res.status(400).json(new ApiResponse(400, {}, "Internal server error."))
  }
})