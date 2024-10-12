const createError = require("http-errors");
const mongoose = require("mongoose");

const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) throw createError(404, `${Model.modelName} dosn't exist`);

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(404, `Invalid ${Model.modelName} id mongoose`);
    }
    throw error;
  }
};

module.exports = {
  findWithId,
};
