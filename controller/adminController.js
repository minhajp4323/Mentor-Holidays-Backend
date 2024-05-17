import jwt from "jsonwebtoken";
import users from "../model/userSchema.js";
import { joiPropertySchema } from "../model/validateSchema.js";
import properties from "../model/productSchema.js";

//login
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_USERNAME
  ) {
    const token = jwt.sign(
      { username: username },
      process.env.ADMIN_ACCESS_TOKEN
    );
    res.status(200).json({
      status: "Success",
      message: "Succesfully logged in",
      token: token,
    });
  } else {
    res.status(400).json({ status: "Error", message: "incorrect admin ID" });
  }
};

//all user

export const AllUser = async (req, res) => {
  const allUser = await users.find();
  if (!allUser) {
    res.status(404).json({
      status: "Not found",
      message: "No users found",
    });
  }
  res.status(200).json({
    status: "Success",
    message: "Fetched all users",
    data: allUser,
  });
};

//user by id

export const userById = async (req, res) => {
  const userId = req.params.id;
  const userById = await users.findById(userId);
  if (!userById) {
    res
      .status(404)
      .json({ status: "Not found", message: "User not foud by id" });
  }
  res.status(200).json({
    status: "Success",
    message: "Succesfully fetched user by id",
    data: userById,
  });
};
export const addProperties = async (req, res) => {
  const { value, error } = joiPropertySchema.validate(req.body);
  const { title, price, location, images, description, category } = value;
  console.log(value);

  if (error) {
    res
      .status(400)
      .json({ status: "Error", message: error.details [0].message });
  } else {
    const addedProperty = await properties.create({
      title,
      price,
      location,
      images,
      description,
      category,
    });
    res.status(200).json({
      status: "Success",
      message: "Added properties Successfully",
      data: addedProperty,
    });
  }
};
