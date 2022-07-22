import mongoose from "mongoose";
import User from "./user.model.js";
const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: User,
    },
    desc: {
      type: String,
      max: 500,
    },
    image: String,
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: User,
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("find", function (next) {
  this.populate({
    path: "author",
    select: "fullname username",
  });

  this.populate({
    path: "likes",
    select: "fullname username",
  });

  next();
});

const Post = mongoose.model("Posts", postSchema);
export default Post;
