const { seedUser, seedDisease } = require("../controllers/seedController");
const seedRouter = require("express").Router();
//
//
// seed user
seedRouter.get("/users", seedUser);
seedRouter.get("/disease", seedDisease);
//
//
// export module
module.exports = seedRouter;
