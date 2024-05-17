import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  // images: [{ type: String }],
  images: String,
  description: String,
  category: String,
});

const Property = mongoose.model("property", propertySchema);
export default Property;
