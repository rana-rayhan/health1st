const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Post title must be at least 3 characters"],
      maxlength: [50, "Post title must be less then 50 characters"],
    },
    content: {
      type: String,
      required: true,
      minlength: [3, "Post content must be at least 3 characters"],
      maxlength: [1000, "Post content must be less then 1000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diseases: {
      type: Schema.Types.ObjectId,
      ref: "Disease", // Connect disease with post
      trim: true,
      lowercase: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
