import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import appError from "../utils/appError.js";

// CREATE POST
export const CREATE_POST = async (req, res) => {
  const author = req.user.id;
  const newPost = await Post.create({ author, ...req.body });

  res.status(200).json({
    status: "success",
    data: { post: newPost },
  });
};

// GET POST
export const GET_POST = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);

  if (post) {
    res.status(200).json({
      status: "success",
      data: { post },
    });
  } else {
    res.status(200).json({
      status: "fail",
      data: null,
      message: "Post not exists",
    });
  }
};

// UPDATE POST
export const UPDATE_POST = async (req, res, next) => {
  const postID = req.params.id;
  const userID = req.user.id;

  const post = await Post.findById(postID);

  if (!post) {
    return next(new appError("Invalid post ID"));
  }

  if (post.author == userID) {
    // update logic
    const updatedPost = await post.updateOne({ $set: req.body });
    res.status(200).json({
      status: "success",
      message: "Updating post successfully",
    });
  } else {
    res.status(403).json({
      status: "fail",
      message: "Action forbiden",
    });
  }
};

// DELETE POST
export const DELETE_POST = async (req, res) => {
  const postId = req.params.id;
  const userID = req.user.id;

  const post = await Post.findById(postId);

  if (post.author == userID) {
    // update logic
    await post.deleteOne();
    res.status(200).json({
      status: "success",
      message: "Post has been deleted",
    });
  } else {
    res.status(403).json({
      status: "fail",
      data: null,
      message: "Action forbiden",
    });
  }
};

// like/unlike post
export const REACT_POST = async (req, res) => {
  const postID = req.params.id;
  const userID = req.user.id;

  console.log(userID);

  const post = await Post.findById(postID);
  if (!post.likes.includes(userID)) {
    // like action
    await post.updateOne({ $push: { likes: userID } });
    res.status(200).json({
      status: "success",
      message: "Post has been liked",
    });
  } else {
    // unlike action
    await post.updateOne({ $pull: { likes: userID } });
    res.status(200).json({
      status: "success",
      message: "Post has been unliked",
    });
  }
};

// Get Timeline Posts
export const GET_TIMELINE = async (req, res) => {
  const userID = req.user.id;

  const currentUser = await User.findById(userID);
  const currentUserPosts = await Post.find({ author: userID });
  const followingPosts = await Post.find({
    author: { $in: currentUser.followings },
  });

  // const followingPosts = await User.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(userID),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "posts",
  //       localField: "followings",
  //       foreignField: "author",
  //       as: "followingPosts",
  //     },
  //   },
  //   {
  //     $project: {
  //       followingPosts: 1,
  //       _id: 0,
  //     },
  //   },
  // ]);

  res.status(200).json(
    currentUserPosts.concat(followingPosts).sort((a, b) => {
      return b.createdAt - a.createdAt;
    })
  );
};
