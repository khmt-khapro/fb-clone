import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail],
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    // passwordConfirm: {
    //   type: String,
    //   required: true,
    //   minlength: 6,
    //   validate: {
    //     validator: function (value) {
    //       return value == this.password; // passConfirm == pass ???
    //     },
    //     message: "Password confirm does not match",
    //   },
    // },
    fullname: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    about: String,
    livesIn: String,
    workAt: String,
    relationship: String,
    country: String,
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    passwordChangeAt: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  // Only run this function if password was moddified (not on other update functions)
  if (!this.isModified("password")) return next();
  // Hash password with strength of 12
  this.password = bcrypt.hashSync(this.password, 12);
  //remove the confirm field
  // this.passwordConfirm = undefined;
  next();
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

UserSchema.methods.verifyPassword = function (clientPass, userPass) {
  return bcrypt.compareSync(clientPass, userPass);
};

UserSchema.methods.changedPasswordAfter = function (jwtTime) {
  if (this.passwordChangeAt) {
    const changedTime = parseInt(this.passwordChangeAt.getTime() / 1000, 10); //ms to s
    return jwtTime < changedTime;
  }
  // false mean not change
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model("Users", UserSchema);
export default User;
