import Joi from "joi";

export const joiUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phonenumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});


export const joiPropertySchema = Joi.object({
  title: Joi.string(),
  location: Joi.string(),
  price: Joi.number(),
  // images: Joi.string(),
  images: Joi.array().items(Joi.string()),
  description: Joi.string(),
  category: Joi.string(),
});
