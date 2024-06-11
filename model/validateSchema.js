import Joi from "joi";

export const joiUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phonenumber: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({'any.only': 'Passwords do not match'})
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
});
