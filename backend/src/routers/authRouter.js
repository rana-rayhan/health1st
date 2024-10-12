const authRouter = require("express").Router();
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { runValidation } = require("../validators");
const { validateUserLogin } = require("../validators/auth");
//
//
// user auth route
authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin
);
authRouter.get("/logout", isLoggedIn, handleLogout);

authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtectedRoute);
//
//
// export module
module.exports = authRouter;
