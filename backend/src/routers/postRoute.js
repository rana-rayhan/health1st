const {
  handleCreatePost,
  handleViewPosts,
  handleDeletePost,
  handleFindPostById,
  handleUpdatePost,
  handleUserPost,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/auth");
const { runValidation } = require("../validators");
const { validatePost } = require("../validators/postValidator");
const postRouter = require("express").Router();
//
//
// user post route
postRouter.get("/", handleViewPosts);
postRouter.get("/:id([0-9a-fA-F]{24})", handleFindPostById);
postRouter.post(
  "/create",
  isLoggedIn,
  validatePost,
  runValidation,
  handleCreatePost
);
postRouter.put(
  "/update/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  validatePost,
  runValidation,
  handleUpdatePost
);
postRouter.delete("/delete/:id([0-9a-fA-F]{24})", isLoggedIn, handleDeletePost);

postRouter.get("/user-post", isLoggedIn, handleUserPost);
//
//
// export route
module.exports = postRouter;
