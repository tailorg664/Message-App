const User = require("../model/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
// Function to create refresh and access token
const createRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken(userId);
    const accessToken = user.generateAccessToken(userId);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error);
  }
};
// Controllers
exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = new User({
    username,
    email,
    password,
  });
  await newUser.save();
  if (!newUser) {
    return res.status(400).send("Please fill all the fields");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered Successfully"));
});
exports.loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //check if the username or email is provided
  if (!email && !username) {
    throw new ApiError(400, "Username or email is required for loging user!");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  //check if the user exists
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // Compare input password with hashed password in the database
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);
  
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");
  //token generation by calling the function createRefreshAndAccessToken
  const { refreshToken, accessToken } = await createRefreshAndAccessToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httponly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login successful"
      )
    );
});
exports.logoutUser = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is missing from the request"));
  }
  const userId = req.user._id.toString().replace(/^String\("(.*)"\)$/, "$1");
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httponly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});
