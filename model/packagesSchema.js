import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("packages", PackageSchema);
