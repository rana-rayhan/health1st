const Comment = require("../models/commentModel");
const Disease = require("../models/diseaseModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { findWithId } = require("../services/findItem");
const { successResponse } = require("./responseController");
const createError = require("http-errors");
//
//
// create new post ---***
const handleCreatePost = async (req, res, next) => {
  try {
    const { title, content, diseaseName } = req.body;
    const author = req.user._id;
    let lo = diseaseName.toLowerCase();
    // Check if the disease exists in the database
    const disease = await Disease.findOne({ name: lo });
    if (!disease) throw createError(404, "Please input a valid disease!");

    // Create a new post document
    const newPost = await Post.create({
      title,
      content,
      author,
      diseases: disease._id ? disease._id : null, // Associate the post with the disease
    });

    // Update the User model to add the new post ID
    await User.findByIdAndUpdate(author, {
      $push: { posts: newPost._id },
    });

    // Update the Disease model to add the new post ID
    await Disease.findByIdAndUpdate(disease._id, {
      $push: { posts: newPost._id },
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate({
        path: "comments",
        select: "content",
        populate: {
          path: "author",
          select: "name",
        },
      })
      .populate("author", "name") // Include the name of the post author
      .populate("diseases", "name"); // Include the name of the disease

    // Return the saved post as a successful response
    return res.status(201).json({
      message: "Post created successfully",
      post: populatedPost, // Return the saved post
    });
  } catch (error) {
    // If an error occurs, pass it to the error handler
    next(error);
  }
};
//
//
// get all post
const handleViewPosts = async (req, res, next) => {
  try {
    // Variables for responsive search, pagination, and limit
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    // Filter for search in title, content, or author's name
    const filter = {
      $or: [
        { title: { $regex: searchRegExp } },
        { content: { $regex: searchRegExp } },
      ],
    };

    // Find posts and populate the author field without sensitive info
    const posts = await Post.find(filter)
      //   .populate("author", "name")
      .populate({
        path: "comments",
        select: "content", // Specify fields you want to include for comments
        populate: {
          path: "author",
          select: "name", // Specify fields you want to include for comment authors
        },
      })
      .populate(
        "author",
        "name" // Specify fields you want to include for post authors
      )
      .populate(
        "diseases",
        "name" // Specify fields you want to include for post authors
      )
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Count total documents for pagination
    const count = await Post.countDocuments(filter);

    // If no posts are found, return a 404 error
    if (!posts.length) throw createError(404, "No posts found");

    // Success response with pagination info
    return successResponse(res, {
      statusCode: 200,
      message: "Posts were returned successfully",
      payload: {
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
        count,
        posts,
      },
    });
  } catch (error) {
    // If any error, catch and pass it to the error handler
    next(error);
  }
};
//
//
// get all post
const handleFindPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await findWithId(Post, postId);
    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "Post fetched seccessfully",
      payload: post,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// Update a user || PUT request
const handleUpdatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    // find a post by id ---***
    const post = await findWithId(Post, postId);
    // Check if the user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      throw createError(403, "You are not authorized to update this post");
    }
    // created option for run validator and context query
    const updateOptions = { new: true, runValidators: true, context: "query" };
    // find and update a post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      updateOptions
    );

    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "Post was updated seccessfully",
      payload: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
//
//
// get all post
const handleDeletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const user = req.user;
    // find a user by id ---***
    const post = await Post.findById(postId).populate("author", "name");

    // post can delete only author and adimn
    if (post.author._id.toString() === user._id || user.isAdmin) {
      await Comment.deleteMany({ post: postId });
      await Post.findByIdAndDelete({ _id: postId });
    } else {
      throw createError(404, "Author or Admin can delete the post");
    }
    // return users into response controller--**
    return successResponse(res, {
      statusCode: 200,
      message: "Post was deleted seccessfully",
    });
  } catch (error) {
    next(error);
  }
};
//
//
// get all post for user
const handleUserPost = async (req, res, next) => {
  try {
    const userId = req.user._id; // Logged-in user's ID

    // Fetch all posts where the author is the current user
    const posts = await Post.find({ author: userId })
      .populate({
        path: "comments",
        select: "content", // Specify fields you want to include for comments
        populate: {
          path: "author",
          select: "name", // Specify fields you want to include for comment authors
        },
      })
      .populate(
        "author",
        "name" // Specify fields you want to include for post authors
      )
      .populate(
        "diseases",
        "name" // Specify fields you want to include for post authors
      )
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0)
      throw createError(404, "No posts found for this user");

    return successResponse(res, {
      statusCode: 200,
      message: "Posts fetched successfully",
      payload: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreatePost,
  handleViewPosts,
  handleDeletePost,
  handleFindPostById,
  handleUpdatePost,
  handleUserPost,
};
