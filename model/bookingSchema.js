import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    title: { type: String },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentTime: { type: String }, 
    receipt: { type: String, required: true },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;
