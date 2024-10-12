const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");

const connectDB = async (option = {}) => {
  try {
    await mongoose.connect(mongodbUrl, option);
    console.log("db is connected successfully");

    // db connected error check
    mongoose.connection.on("error", (error) => {
      console.log("error", "db connection error", error);
    });
  } catch (error) {
    console.log("error", "db is not connected", error);
  }
};

module.exports = connectDB;
