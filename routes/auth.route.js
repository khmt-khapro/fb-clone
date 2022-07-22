import express from "express";
const router = express.Router();
import * as authController from "../controllers/auth.controller.js";
import catchAsync from "./../utils/catchAsync.js";
import { verifyRole, verifyToken } from "./../middlewares/auth.middleware.js";

router.post("/register", catchAsync(authController.REGISTER));
router.post("/login", catchAsync(authController.LOGIN));
router.post("/forgotPassword", catchAsync(authController.FORGOT_PASSWORD));
router.post("/resetPassword/:token", catchAsync(authController.RESET_PASSWORD));

// auth middleware
router.use(verifyToken);
router.post("/verifyUser", (req, res) => [
  res.status(200).json({ status: "success", message: "Verified" }),
]);
router.post("/updatePassword", catchAsync(authController.UPDATE_PASSWORD));
// router.patch("/updateProfile", catchAsync(authController.UPDATE_PROFILE));

export default router;
