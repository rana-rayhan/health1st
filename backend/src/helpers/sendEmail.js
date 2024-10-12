const createError = require("http-errors");
const { activeEmailWithNodeMailer } = require("./email");

const sendEmail = async (emailData) => {
  try {
    await activeEmailWithNodeMailer(emailData);
  } catch (error) {
    throw createError(500, "Faild to send varification email");
  }
};

module.exports = sendEmail;
