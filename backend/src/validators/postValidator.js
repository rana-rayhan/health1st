const { body } = require("express-validator");

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 3 })
    .withMessage("Content must be at least 3 characters long"),
];

module.exports = { validatePost };
