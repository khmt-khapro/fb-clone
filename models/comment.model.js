import mongoose from "mongoose";
import User from "./user.model.js";

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  postId: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
});

commentSchema.pre(
  /^find/,
  function (next) {
    this.populate({
      path: "author",
      select: "fullname username",
    });

    next();
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comments", commentSchema);
export default Comment;
