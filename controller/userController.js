import { joiUserSchema } from "../model/validateSchema.js";
import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Property from "../model/productSchema.js";

// registering user

export const registerUser = async (req, res) => {
  const { value, error } = joiUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: "Invalid user input. Check the input." });
  }
  const { username, email, phonenumber, password } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered." });
    }
    const userData = new User({
      username,
      email,
      phonenumber,
      password: hashedPassword,
    });

    await userData.save();

    res.status(201).json({
      status: "Success",
      message: "User successfully registered.",
      data: userData,
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: err.message });
  }
};

// userlogin

export const login = async (req, res) => {
  const { value, error } = joiUserSchema.validate(req.body);
  try {
    const { username, password } = value;
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      res.status(404).json({
        status: "Not found",
        message: "User Not found",
      });
    }
    if (!password || !user.password) {
      res.status(400).json("No password entered");
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      res.status(400).json({
        status: "Error",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN
    );
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      token: token,
      data: user,
    });
  } catch (err) {
    console.error(err);
  }
};

// display all properties

export const allProperty = async (req, res) => {
  try {
    const allProps = await Property.find();
    if (!allProps) {
      res
        .status(404)
        .json({ status: "Not found", message: "No properties to display" });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Fetched all properties",
        data: allProps,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// display single propertyById

export const propertyById = async (req, res) => {
  try {
    const propId = req.params.id;
    const propById = await Property.findById(propId);

    if (!propById) {
      res.status(404).json({
        status: "Not found",
        message: "Porperty not found in the data base",
      });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Succesfully fetched proprty by id",
        data: propById,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// single user

export const currentUser = async (req, res) => {
  const userId = req.params.id
  const userById = await User.findById(userId);
  if (!userById) {
    res.status(404).json({ status: "Not found", message: "User not found" });
  } else {
    res.status(200).json({
      status: "Success",
      message: "User details fetched successfully",
      data: userById,
    });
  }
};
