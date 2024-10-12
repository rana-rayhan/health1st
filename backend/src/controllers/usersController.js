const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const { jwtActivationKey, clientUrl } = require("../secret");
// const { activeEmailWithNodeMailer } = require("../helpers/email");
const sendEmail = require("../helpers/sendEmail");
const { manageUserStatus } = require("../services/userServices");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
//
//
// process-register || POST request
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    // check is user exist or not
    const userExist = await User.exists({ email: email });
    if (userExist)
      throw createError(409, "User is already exist, please sign up");

    const user = await User.create({ name, email, password, phone });

    // creating token for user verification
    // let tokenPayload = { name, email, password, phone };
    // const token = createJsonWebToken(tokenPayload, jwtActivationKey, "1h");

    // // prepair email for user activation
    // const emailData = {
    //   email,
    //   subject: "Account Activation Email",
    //   html: `
    //       <h2> Hello ${name} ! </h2>
    //       <p> Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank" > active your account </a> </p>
    //   `,
    // };

    // // send email with node mailer
    // sendEmail(emailData);

    // return users into response controller--**

    return successResponse(res, {
      statusCode: 200,
      message: `Please login`,
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// verify and register a user || POST request
const verifyUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found");
    //-----***
    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "Unable to verify user");

      const userExist = await User.exists({ email: decoded.email });
      if (userExist)
        throw createError(409, "User is already exist, please sign up");

      await User.create(decoded);

      // return users into response controller--**
      return successResponse(res, {
        statusCode: 200,
        message: "User was registered successfully",
        payload: decoded,
      });
      //----****
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid token");
      } else {
        throw error;
      }
    }
    // -----****
  } catch (error) {
    next(error);
  }
};
//
//
// view user get request by admin
const viewUser = async (req, res, next) => {
  try {
    // variable for responsive
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    // filter user by admin needs --**
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    // return user without password --**
    const options = { password: 0 };
    // find user from database --**
    const users = await User.find(filter, options)
      .limit(limit) // first 5 person
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate("posts"); // ((1-1)*5) = 0 skiped person

    // counting user from database --**
    const count = await User.find(filter).countDocuments();
    // if not user throw an error
    if (!users) throw createError(404, "No user found");

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned seccessfully",
      payload: {
        count,
        users,
        // pagination --**
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    // if any error then catch the error into next(error) -- app.js
    next(error);
  }
};
//
//
// get single user by id || get request
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // find a user by id ---***
    const user = await findWithId(User, id, options);
    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "User were returned seccessfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
//
//
// delete user by id || delete request
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // find a user by id ---***
    const user = await findWithId(User, id, options);

    // if user not a admin then delete it
    if (!user.isAdmin) {
      await Post.deleteMany({ author: id });
      await Comment.deleteMany({ author: id });
      await User.findByIdAndDelete({ _id: id, isAdmin: false });
    } else {
      throw createError(404, "User is admin & can't be deleted");
    }
    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted seccessfully",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Update a user || PUT request
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // find a user by id ---***
    const user = await findWithId(User, userId);
    // created option for run validator and context query
    const updateOptions = { new: true, runValidators: true, context: "query" };
    // updated data object
    const updatedData = {};
    // user can update anything without email
    const allowedFileds = ["name", "password", "phone", "address", "image"];
    for (let key in req.body) {
      if (allowedFileds.includes(key)) {
        updatedData[key] = req.body[key];
      } else if (key === "email") {
        // only admin can update email error for user
        throw createError(403, "Only admin can update your email");
      }
    }
    // find and update a user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      updateOptions
    ).select("-password");

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "User was updated seccessfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Ban & unban user|| PUT request
const hanldeManageUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;
    await manageUserStatus(action, userId);
    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: `User was ${action} seccessfully!`,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Update user password || PUT request
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    console.log(newPassword);
    const user = await findWithId(User, userId);

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    //if password not match
    if (!isPasswordMatch) throw createError(400, "Old password did not match");

    // created option
    const updateOptions = { new: true };
    // updated data object   runValidators: true, context: "query"
    const updatedData = { $set: { password: newPassword } };

    // find and update a user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      updateOptions
    ).select("-password");

    if (!updatedUser)
      throw createError(400, "User password was not updated successfully");

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "User password was updated seccessfully",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Forget user password || Post request
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found, please register first");

    // creating token for user verification
    const token = createJsonWebToken({ email }, jwtActivationKey, "10m");

    // prepair email for user activation
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
          <h2> Hello ${user.name} ! </h2>
          <p> Please click here to <a href="${clientUrl}/api/users/reset-password/${token}" target="_blank" > Reset your password </a> </p>
      `,
    };

    // send email with node mailer
    sendEmail(emailData);

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: `Please check your email for reset password:  ${email}`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Reset user password || PUT request
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, jwtActivationKey);
    if (!decoded) throw createError(400, "Invalid or Expired token !");
    // created option
    const userEmail = { email: decoded.email };
    // updated data
    const updatedData = { password: password };
    const updateOptions = { new: true };

    // find and update a user
    const updatedUser = await User.findOneAndUpdate(
      userEmail,
      updatedData,
      updateOptions
    ).select("-password");

    if (!updatedUser) throw createError(400, "User password reset failed");

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "User password was Reset seccessfully",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// export module
module.exports = {
  viewUser,
  getUserById,
  deleteUser,
  processRegister,
  verifyUserAccount,
  updateUserById,
  hanldeManageUser,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
