const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const { findWithId } = require("../services/findItem");
const { successResponse } = require("./responseController");
const createError = require("http-errors");
//
//
// create new Comment ---***
const handleCreateComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;
    await findWithId(Post, postId);
    const authorId = req.user._id;

    if (!content) throw createError(403, "Comment cannot be null!");

    // Create a new Comment document
    const newComment = await Comment.create({
      content,
      author: authorId,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    const commentData = await Comment.findById({
      _id: newComment._id,
    }).populate("author", "name");

    // Return the saved Comment as a successful response
    return successResponse(res, {
      statusCode: 201, // Created
      message: "Comment created successfully",
      payload: commentData, // Return the saved post
    });
  } catch (error) {
    // If an error occurs, pass it to the error handler
    next(error);
  }
};
//
//
// Update a user || PUT request
const handleUpdateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;
    const userId = req.user._id;
    if (!content) throw createError(403, "Comment cannot be null!");

    // find a post by id ---***
    const comment = await findWithId(Comment, commentId);

    if (comment.author.toString() !== userId.toString()) {
      throw createError(403, "You are not authorized to update this post");
    }
    // created option for run validator and context query
    const updateOptions = { new: true, runValidators: true, context: "query" };
    // find and update a post
    const updatedPost = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      updateOptions
    );

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "Comment was updated seccessfully",
      payload: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// get all post
const handleDeleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id; // Comment ID from URL
    const userId = req.user._id; // ID of the current user

    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw createError(404, "Comment not found");
    }

    // Check if the user is the author of the comment or is an admin
    if (comment.author.toString() === userId.toString() || req.user.isAdmin) {
      await Comment.findByIdAndDelete(commentId);
    } else {
      throw createError(403, "You are not authorized to delete this comment");
    }

    // Return success response
    return successResponse(res, {
      statusCode: 200,
      message: "Comment was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
};
