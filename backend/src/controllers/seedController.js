const data = require("../data");
const Disease = require("../models/diseaseModel");
const User = require("../models/userModel");
//
//
// seed controller get request
const seedUser = async (req, res, next) => {
  try {
    // deleting all users
    await User.deleteMany({});
    //inserting users
    const users = await User.insertMany(data.users);

    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

//
//
// seed controller get request
const seedDisease = async (req, res, next) => {
  try {
    console.log("----------------*************");
    // deleting all users
    await Disease.deleteMany({});
    //inserting users
    const users = await Disease.insertMany(data.diseases);

    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};
//
//
// export module
module.exports = {
  seedUser,
  seedDisease,
};
