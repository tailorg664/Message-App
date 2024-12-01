const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const ApiError = require("../utils/ApiError");

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized, please login");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Unauthorized, please login");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
module.exports = verifyJwt