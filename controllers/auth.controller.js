import User from "../models/user.model.js";
import crypto from "crypto";
import appError from "../utils/appError.js";
import * as JoiValidate from "../utils/validate.js";
import { SEND_MAIL } from "../services/sendmail.service.js";
import signToken from "../utils/signToken.js";

// CREATE NEW USER
export const REGISTER = async (req, res, next) => {
  const { value, error } = JoiValidate.register.validate(req.body);
  if (error) {
    return next(new appError(error.message, 400));
  }

  const newUser = await User.create(value);
  const { password, ...other } = newUser._doc;

  res.status(200).json({
    status: "success",
    data: { user: other },
  });
};

// LOGIN
export const LOGIN = async (req, res, next) => {
  const { value, error } = JoiValidate.login.validate(req.body);
  if (error) {
    return next(new appError(error.message, 401));
  }
  const { email, password } = value;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new appError("Incorrect email, try  again", 401));
  }

  const correct = user.verifyPassword(password, user.password);
  if (!correct) {
    return next(new appError("Incorrect password, try  again", 401));
  }

  const jwtToken = signToken(user._id, user.isAdmin);
  res.status(200).json({ status: "succes", token: jwtToken });
};

export const FORGOT_PASSWORD = async (req, res, next) => {
  const { value, error } = JoiValidate.forgotPassword.validate(req.body);
  if (error) {
    return next(new appError(error.message, 400));
  }

  const user = await User.findOne({ email: value.email });
  if (!user) {
    return next(new appError("There is no user with this email", 400));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

  try {
    await SEND_MAIL(email, resetURL);
    res.status(200).json({ status: "success", message: "email was sent" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(new appError("There is an error when send email", 500));
  }
};

export const RESET_PASSWORD = async (req, res, next) => {
  const { token } = req.params;
  const { value, error } = JoiValidate.resetPassword.validate(req.body);
  const { password, passwordConfirm } = value;
  if (!token) {
    return next(new appError("There is no token", 400));
  }

  if (error) {
    return next(new appError(error.message, 400));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ passwordResetToken: hashedToken });
  if (!user) {
    return next(new appError("Invalid token", 400));
  }

  if (user.passwordResetExpire < Date.now())
    return next(new appError("Token has been expired", 400));

  // all right, update user password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  const jwtToken = signToken(user._id, user.isAdmin);
  res.status(200).json({ status: "succes", token: jwtToken });
};

export const UPDATE_PASSWORD = async (req, res, next) => {
  const { value, error } = JoiValidate.updatePassword.validate(req.body);
  if (error) {
    return next(new appError(error.message, 400));
  }

  const { currentPassword, password, passwordConfirm } = value;
  // find user by id from auth middleware
  const user = await User.findById(req.user.id).select("+password");
  // check if user request current pass are correct
  const correctPass = await user.verifyPassword(currentPassword, user.password);
  if (!correctPass) {
    return next(new appError("Your current password are incorrect", 401));
  }

  // if true, then change the password
  // dont use findByIdAndUpdate because methods in model not run !!!
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // create token and log user in
  const jwtToken = signToken(user._id, user.isAdmin);
  res.status(200).json({ status: "success", token: jwtToken });
};

// export const UPDATE_PROFILE = async (req, res, next) => {
//   const { value, error } = updateProfileSchema.validate(req.body);
//   if (error) {
//     return next(new appError(error.message, 400));
//   }

//   const updatedUser = await User.findByIdAndUpdate(req.user.id, value, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({ status: "success", data: { user: updatedUser } });
// };
