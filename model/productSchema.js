import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  bedroom: String,
  bathroom: String,
  images: [{ type: String }],
  description: String,
  category: String,
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
