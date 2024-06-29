import Joi from "joi";

export const joiUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email(),
  phonenumber: Joi.number().min(10),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .messages({ "any.only": "Passwords do not match" }),
});

export const joiPropertySchema = Joi.object({
  title: Joi.string(),
  location: Joi.string(),
  price: Joi.number(),
  bathroom: Joi.string(),
  bedroom: Joi.string(),
  images: Joi.array().items(Joi.string()),
  description: Joi.string(),
  category: Joi.string(),
  maxGuest: Joi.string(),
});
