import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import catchAsync from "./../utils/catchAsync.js";
const router = express.Router();
import {
  GET_ALL_USER,
  GET_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_ME,
} from "../controllers/user.controller.js";

router.get("/", catchAsync(GET_ALL_USER));
router.get("/:id", catchAsync(GET_USER));
router.put("/updateMe", verifyToken, catchAsync(UPDATE_ME));
// router.delete("/:id", verifyToken, deleteUser);
router.put("/:id/follow", verifyToken, catchAsync(FOLLOW_USER));
router.put("/:id/unfollow", verifyToken, catchAsync(UNFOLLOW_USER));

export default router;
