const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const { successResponse } = require("./responseController");
const { jwtActivationKey } = require("../secret");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../helpers/setCookie");

//
//
// login user and athinticate
const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not Exist. Please register first");

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    //if password not match
    if (!isPasswordMatch)
      throw createError(401, "Password or Email did not match");
    //if user is banned
    if (user.isBanned)
      throw createError(403, "You are banned, please contact authority");

    // creating access token for user verification
    const token = createJsonWebToken({ user }, jwtActivationKey, "15m");
    setAccessTokenCookie(res, token);

    // creating refresh token for user verification
    const refreshToken = createJsonWebToken({ user }, jwtActivationKey, "7d");
    setRefreshTokenCookie(res, refreshToken);

    return successResponse(res, {
      statusCode: 200,
      message: "User is logged in successfully",
      payload: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Logout user
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User is logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Refresh token for user
const handleRefreshToken = async (req, res, next) => {
  try {
    // get refresh token from cookies
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken)
      throw createError(403, "Token is missing, please login again");

    // decoded user info from token
    const decoded = jwt.verify(oldRefreshToken, jwtActivationKey);
    if (!decoded)
      throw createError(401, "Please Login again, Invalid refresh token");

    // creating token with refresh token
    const token = createJsonWebToken(decoded.user, jwtActivationKey, "15m");
    setAccessTokenCookie(res, token);

    return successResponse(res, {
      statusCode: 200,
      message: "User Token is reshreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// protected route for user
const handleProtectedRoute = async (req, res, next) => {
  try {
    // get access token from cookies
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      throw createError(403, "Token is missing, please login again");
    // decoded user info from token
    const decoded = jwt.verify(accessToken, jwtActivationKey);
    if (!decoded)
      throw createError(401, "Please Login again, Invalid refresh token");

    return successResponse(res, {
      statusCode: 200,
      message: "Protected access granted",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// exports module
module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
