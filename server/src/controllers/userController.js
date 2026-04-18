import User from "../model/UserSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";

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

const checker = (req, res) => {
  res.send("Checker function is working");
  res.status(200).json({ message: "Checker function is working" });
};
const createUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

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

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: newUser, token: token },
        "User registered Successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const token = await createToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -Token");
  console.log(loggedInUser);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        token,
      },
      "Login successful",
    ),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user);

  if (!req.user || !req.user._id) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is missing from the request"));
  }

  const userId = req.user._id.toString().replace(/^String\("(.*)"\)$/, "$1");
  const user = await User.findByIdAndUpdate(userId, { token: undefined });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res.status(200).json(new ApiResponse(200, {}, "user logged out"));
});

const checkAuth = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error.message);
    throw new ApiError(401, "User is not authenticated");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (!avatar) {
      throw new ApiError(400, "Please provide a profile picture");
    }

    const uploadResponse = await cloudinary.uploader.upload(avatar);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile", error.message);
    res.status(400).json(new ApiResponse(400, {}, "Internal server error."));
  }
});

export { checker, createUser, loginUser, logoutUser, checkAuth, updateProfile };
