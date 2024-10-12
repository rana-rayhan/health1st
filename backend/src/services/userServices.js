const createError = require("http-errors");
const User = require("../models/userModel");

const manageUserStatus = async (action, userId) => {
  try {
    let update;
    // updated data object
    if (action == "ban") {
      update = { isBanned: true };
    } else if (action == "unban") {
      update = { isBanned: false };
    } else {
      throw createError(403, "Action forbiden!");
    }
    // created option for run validator and context query
    const updateOptions = { new: true, runValidators: true, context: "query" };

    // find and update a user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");

    if (!updatedUser) throw createError(400, `User ${action} unsuccessfull!`);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  manageUserStatus,
};
