const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diseaseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: [3, "Disease name must be at least 3 characters"],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const Disease = mongoose.model("Disease", diseaseSchema);
module.exports = Disease;
