const {
  viewUser,
  getUserById,
  deleteUser,
  processRegister,
  verifyUserAccount,
  updateUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,

  hanldeManageUser,
} = require("../controllers/usersController");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { runValidation } = require("../validators");
const {
  validateUserRegistration,
  validateUserUpdatePassword,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const userRouter = require("express").Router();
//
//
// user routes request
userRouter.post(
  "/process-register",
  isLoggedOut,
  validateUserRegistration, //---** validate user info
  runValidation, //--** run express validator
  processRegister
);
userRouter.post("/verify", isLoggedOut, verifyUserAccount);

userRouter.get("/", isLoggedIn, isAdmin, viewUser);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getUserById);
userRouter.delete("/delete/:id([0-9a-fA-F]{24})", isLoggedIn, deleteUser);
// ban and unban user
userRouter.put(
  "/manage-user/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  hanldeManageUser
);
// update password route
userRouter.put(
  "/update-password/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  validateUserUpdatePassword,
  runValidation,
  handleUpdatePassword
);
// forgot password route
userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
);
// Reset password route
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  handleResetPassword
);
// update user info by id
userRouter.put("/:id([0-9a-fA-F]{24})", isLoggedIn, updateUserById);
//
//
// export module
module.exports = userRouter;
