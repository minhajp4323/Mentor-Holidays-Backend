import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phonenumber: String,
  password: String,
},{timestamps:true});

const UserModel = mongoose.model("users", userSchema);

export default UserModel