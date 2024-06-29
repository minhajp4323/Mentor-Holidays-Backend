import { joiUserSchema } from "../model/validateSchema.js";
import User from "../model/userSchema.js";
import Property from "../model/productSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Booking from "../model/BookingSchema.js";
import Razorpay from "razorpay";
import crypto from "crypto";

import { sendOTP } from "../utility/Mailer.js";
import { title } from "process";

const otpStore = new Map();

// Register user
export const registerUser = async (req, res) => {
  const { value, error } = joiUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, email, phonenumber, password } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const otp = await sendOTP(email);
    otpStore.set(email, otp);

    const userData = {
      username,
      email,
      phonenumber,
      password: hashedPassword,
    };
    otpStore.set(email + "_data", userData);

    res.status(200).json({
      status: "Success",
      message: "OTP sent to email. Please verify.",
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP and complete registration
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);
  const userData = otpStore.get(email + "_data");

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP." });
  }

  try {
    const newUser = new User(userData);
    await newUser.save();

    otpStore.delete(email);
    otpStore.delete(email + "_data");

    res.status(201).json({
      status: "Success",
      message: "User successfully registered.",
      data: newUser,
    });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ error: err.message });
  }
};

// User login
export const login = async (req, res) => {
  const { value, error } = joiUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, password } = value;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }
    if (!password || !user.password) {
      return res.status(400).json({ error: "No password entered" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res
        .status(400)
        .json({ status: "Error", message: "Incorrect password" });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN
    );
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      token,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Display all properties
export const allProperty = async (req, res) => {
  try {
    const allProps = await Property.find();
    if (!allProps.length) {
      return res
        .status(404)
        .json({ status: "Not found", message: "No properties to display" });
    }
    res.status(200).json({
      status: "Success",
      message: "Fetched all properties",
      data: allProps,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Display single property by ID
export const propertyById = async (req, res) => {
  try {
    const propId = req.params.id;
    const propById = await Property.findById(propId);
    if (!propById) {
      return res.status(404).json({
        status: "Not found",
        message: "Property not found in the database",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully fetched property by ID",
      data: propById,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user by ID

export const currentUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const userById = await User.findById(userId);
    if (!userById) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "User details fetched successfully",
      data: userById,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Add property to wishlist

export const addToWishlist = async (req, res) => {
  const userId = req.params.id;
  const { propertyId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }
    if (!user.wishlist.includes(propertyId)) {
      user.wishlist.push(propertyId);
      await user.save();
      res
        .status(200)
        .json({ status: "Success", message: "Property added to wishlist" });
    } else {
      res
        .status(400)
        .json({ status: "Error", message: "Property already in wishlist" });
    }
  } catch (error) {
    console.error("Error adding property to wishlist:", error);
    res.status(500).json({ error: error.message });
  }
};

//remove from wishlist

export const removeFromWishlist = async (req, res) => {
  const userId = req.params.id;
  const { propertyId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }
    user.wishlist = user.wishlist.filter((id) => id.toString() !== propertyId);
    await user.save();
    res
      .status(200)
      .json({ status: "Success", message: "Property removed from wishlist" });
  } catch (error) {
    console.error("Error removing property from wishlist:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get wishlist properties
export const getWishlist = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("wishlist");
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Fetched wishlist properties",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist properties:", error);
    res.status(500).json({ error: error.message });
  }
};

//create booking and payment
export const payment = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET,
  });
  const {
    title,
    bookingId,
    checkInDate,
    guestNumber,
    checkOutDate,
    amount,
    currency,
    receipt,
    propertyId,
    userId,
  } = req.body;

  try {
    const payment = await razorpay.orders.create({ amount, currency, receipt });
    console.log(payment);

    const inRupees = amount/100
    const newBooking = new Booking({
      title,
      bookingId: payment.id,
      checkInDate,
      checkOutDate,
      numberOfGuests: guestNumber,
      amount: inRupees,
      currency,
      paymentDate: new Date(),
      receipt,
      user: userId,
      property: propertyId,
    });

    await newBooking.save();
    console.log(newBooking);

    await User.findByIdAndUpdate(userId, {
      $push: { bookings: newBooking._id },
    });

    return res
      .status(200)
      .json({ status: "Success", message: "Payment initiated", data: payment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//get booking

export const getBooking = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate({
      path: "bookings",
      populate: { path: "property" },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Not found", message: "User not found" });
    }
    res.status(200).json({
      status: "Success",
      message: "Fetched bookings list",
      data: user.bookings,
    });
  } catch (error) {
    console.error("Error fetching booked properties:", error);
    res.status(500).json({ error: error.message });
  }
};
