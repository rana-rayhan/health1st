const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtActivationKey } = require("../secret");
//
//
// login module
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) throw createError(400, "Please log in or register first");
    const decoded = jwt.verify(token, jwtActivationKey);

    if (!decoded)
      throw createError(400, "Invalid access token, please login again");

    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};
//
//
// logout module
const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, jwtActivationKey);
        if (decoded) {
          throw createError(400, "User is already logged in");
        }
      } catch (error) {
        throw error;
      }
    }
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) throw createError(400, "User is already logged in");

    next();
  } catch (error) {
    return next(error);
  }
};
//
//
// user admin  module
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createError(
        403,
        "Request forbidden. You must be an admin to access this resource"
      );
    }

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
};
