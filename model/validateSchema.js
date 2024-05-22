import Joi from "joi";

export const joiUserSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  phonenumber: Joi.number(),
  password: Joi.string(),
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
