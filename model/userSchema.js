import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phonenumber: String,
  password: String,
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Property" }],
  bookings: [{ type: mongoose.Schema.ObjectId, ref: "Booking" }],
});

const User = mongoose.model("User", userSchema);
export default User;
