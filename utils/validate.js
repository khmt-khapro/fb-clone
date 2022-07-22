import Joi from "joi";

const username = Joi.string().alphanum().required().min(4);
const password = Joi.string()
  .required()
  .min(8)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  .messages({
    "string.pattern.base":
      "Minimum 8 characters, at least one letter, one number and one special character",
  });
const passwordConfirm = Joi.string()
  .required()
  .min(8)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  .equal(Joi.ref("password"))
  .messages({
    "string.pattern.base":
      "Minimum 8 characters, at least one letter, one number and one special character",
  })
  .error(new Error("Password confirm must equal to password"));
const email = Joi.string()
  .required()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  });
const fullname = Joi.string().required();
// .regex(/[^a-zA-Z]/, { invert: true })
// .error(new Error("First name can not has speacial character"));

export const register = Joi.object({
  password,
  passwordConfirm,
  email,
  fullname,
});

export const login = Joi.object({
  email,
  password,
});

export const forgotPassword = Joi.object({
  email,
});

export const resetPassword = Joi.object({
  password,
  passwordConfirm,
});

export const updatePassword = Joi.object({
  currentPassword: password,
  password,
  passwordConfirm,
});

export const updateMe = Joi.object({
  fullname: Joi.string(),
  about: Joi.string(),
  livesIn: Joi.string(),
  workAt: Joi.string(),
  relationship: Joi.string(),
  country: Joi.string(),
  profilePicture: Joi.string(),
  coverPicture: Joi.string(),
});
