const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/responseController");
//
//
// module for run express validator
const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
      return;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
//
//
// module export
module.exports = {
  runValidation,
};
