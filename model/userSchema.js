import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    phonenumber: String,
    password: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "wishlist" }],
    bookings:[{type: mongoose.Schema.Types.ObjectId, ref: "bookings"}]
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
