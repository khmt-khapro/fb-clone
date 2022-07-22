import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import appError from "../utils/appError.js";

dotenv.config();
const jwtSecret = process.env.JWT_KEY;

export const verifyToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next(new appError("You are unauthentication", 403));
  }
};

export const verifyRole = () => {
  return (req, res, next) => {
    if (!req.user.role)
      return next(
        new appError("You dont have permision to do this action", 403)
      );

    next();
  };
};
