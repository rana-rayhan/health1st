const { body } = require("express-validator");
//
//
// validation for user registration
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name length must be 3-31 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?8])[A-Za-z\d@$!%*?8]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 6 })
    .withMessage("Phone length must be min 6 characters long"),
  body("image").optional().isString().withMessage("User Image is optional"),
];
//
//
// validation for user Login
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?8])[A-Za-z\d@$!%*?8]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];
//
//
// validation for user password update
const validateUserUpdatePassword = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Old password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?8])[A-Za-z\d@$!%*?8]+$/
    )
    .withMessage(
      "Old Password should contajn at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("New password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?8])[A-Za-z\d@$!%*?8]+$/
    )
    .withMessage(
      "New Password should contajn at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("New password & Confirm password dose not match");
    }
    return true;
  }),
];
//
//
// validation for user forgot password
const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];
//
//
// validation for user Reset password
const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password length must be min 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?8])[A-Za-z\d@$!%*?8]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];
//
//
//
module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdatePassword,
  validateUserForgetPassword,
  validateUserResetPassword,
};
