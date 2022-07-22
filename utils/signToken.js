import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_KEY);
};

export default signToken;
