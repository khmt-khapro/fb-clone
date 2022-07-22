import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import { verifyRole, verifyToken } from "./../middlewares/auth.middleware.js";

import {
  CREATE_POST,
  GET_POST,
  UPDATE_POST,
  DELETE_POST,
  REACT_POST,
  GET_TIMELINE,
} from "../controllers/post.controller.js";

router.use(verifyToken);
router.post("/", catchAsync(CREATE_POST));
router.get("/:id", catchAsync(GET_POST));
router.put("/:id", catchAsync(UPDATE_POST));
router.delete("/:id", catchAsync(DELETE_POST));
router.put("/:id/like", catchAsync(REACT_POST));
router.post("/timeline", catchAsync(GET_TIMELINE));

export default router;
