import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { updateMe } from "../utils/validate.js";
import appError from "../utils/appError.js";

// get user
export const GET_USER = async (req, res) => {
  const id = req.params.id;

  const user = await UserModel.findById(id).select("-__v");

  if (user) {
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: null,
      message: "User does not exists",
    });
  }
};

// get all user
export const GET_ALL_USER = async (req, res) => {
  const users = await UserModel.find().select("-password -__v");

  if (users) {
    res.status(200).json({
      status: "success",
      data: { users },
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: null,
      message: "User does not exists",
    });
  }
};

//  UPDATE PROFILE
export const UPDATE_ME = async (req, res, next) => {
  const userID = req.user.id;
  const { value, error } = updateMe.validate(req.body);
  if (error) {
    return next(new appError(error.message, 400));
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userID, value, {
    new: true,
  });

  res.status(200).json({ status: "success", data: { user: updatedUser } });
};

// DELETE USER
// export const deleteUser = async (req, res) => {
//   const id = req.params.id;
//   const { currentUserId, currentUserAdminStatus } = req.body;

//   if (id == currentUserId || currentUserAdminStatus) {
//     try {
//       const deletedUser = await UserModel.findByIdAndDelete(id);
//       if (deletedUser) {
//         res.status(200).json("User has been deleted !!");
//       } else {
//         res.status(403).json({ message: "user id is invalid" });
//       }
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   } else {
//     res.status(403).json({ message: "can not delete user !!!" });
//   }
// };

// FOLLOW USER
export const FOLLOW_USER = async (req, res) => {
  const followedUserID = req.params.id;
  const currentUserID = req.user.id;

  // can not follow your self
  if (followedUserID == currentUserID) {
    res
      .status(403)
      .json({ status: "fail", message: "Can not follow yourself" });
  } else {
    const followedUser = await UserModel.findById(followedUserID);
    const followingUser = await UserModel.findById(currentUserID);

    // adding validate user if id not valid from postman request , do this later

    // checking is following or not
    if (!followedUser.followers.includes(currentUserID)) {
      //add new people who follow
      await followedUser.updateOne({
        $push: { followers: new mongoose.Types.ObjectId(currentUserID) },
      });
      await followingUser.updateOne({
        $push: { followings: new mongoose.Types.ObjectId(followedUserID) },
      });
      res
        .status(200)
        .json({ status: "success", message: "Follow user successfully" });
    } else {
      res
        .status(403)
        .json({ status: "fail", message: "You already follow this user" });
    }
  }
};

// UNFOLLOW USER
export const UNFOLLOW_USER = async (req, res) => {
  const followedUserID = req.params.id;
  const currentUserID = req.user.id;

  // can not follow your self
  if (followedUserID == currentUserID) {
    res.status(403).json({ status: "fail", message: "Action forbiden" });
  } else {
    const followedUser = await UserModel.findById(followedUserID);
    const followingUser = await UserModel.findById(currentUserID);

    // adding validate user , do this later

    // checking is following or not
    if (followedUser.followers.includes(currentUserID)) {
      //add new people who follow
      await followedUser.updateOne({
        $pull: { followers: new mongoose.Types.ObjectId(currentUserID) },
      });
      await followingUser.updateOne({
        $pull: { followings: new mongoose.Types.ObjectId(followedUserID) },
      });
      res
        .status(200)
        .json({ status: "success", message: "Unfollow successfully" });
    } else {
      res
        .status(403)
        .json({ status: "fail", message: "You not follow this user" });
    }
  }
};
