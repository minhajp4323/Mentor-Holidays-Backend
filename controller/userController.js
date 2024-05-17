import { joiUserSchema } from "../model/validateSchema.js";
import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { value, error } = joiUserSchema.validate(req.body);
  const { username, email, phonenumber, password } = value;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("value:", value);

  if (error) {
    res.status(400).json({ error: "Invalid user input, Check the input" });
  }
  const existingUser = await User.findOne({
    username: username,
  });
  console.log(`Existing user is ${existingUser}`);
  if (existingUser) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }

  const userData = new User({
    username: username,
    email: email,
    phonenumber: phonenumber,
    password: hashedPassword,
  });
  await userData.save();
  console.log("New User is ", userData);
  res.status(200).json({
    status: "Success",
    message: "User successfully registered",
    data: userData,
  });
};

export const login = async (req, res) => {
  const { value, error } = joiUserSchema.validate(req.body);
  if (error) {
    console.error(error.message);
  }
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
};
