const {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
} = require("../controllers/commentController");
const { isLoggedIn } = require("../middlewares/auth");
const commentRouter = require("express").Router();
//
//
// user comment routing
commentRouter.post("/create", isLoggedIn, handleCreateComment);
commentRouter.put(
  "/update/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  handleUpdateComment
);
commentRouter.delete(
  "/delete/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  handleDeleteComment
);
//
//
// export route
module.exports = commentRouter;
