import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  phonenumber: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
});

const User = mongoose.model("User", userSchema);

export default User;
