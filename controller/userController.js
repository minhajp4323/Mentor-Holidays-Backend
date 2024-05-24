import { joiUserSchema } from "../model/validateSchema.js";
import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {

  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: "Invalid user input. Check the input." });
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
