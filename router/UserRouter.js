import express from "express";
import {
  addToWishlist,
  allProperty,
  checkDateAvailability,
  // checkDateAvailability,
  createBooking,
  currentUser,
  getBooking,
  getWishlist,
  login,
  payment,
  // paymentAndBooking,
  propertyByCategory,
  propertyById,
  registerUser,
  removeFromWishlist,
  verifyOTP,
} from "../controller/userController.js";
// import verifyUserToken from "../middlewares/UserAuth.js";

const app = express.Router();

app
  .post("/register", registerUser)
  .post("/verifyotp", verifyOTP)
  .post("/login", login)
  .get("/properties", allProperty)
  .get("/properties/:id", propertyById)
  // .use(verifyUserToken)
  .get("/user/:id", currentUser)
  .post("/wishlist/:id", addToWishlist)
  .delete("/wishlist/:id", removeFromWishlist)
  .get("/wishlist/:id", getWishlist)
  .post("/payment", payment)
  .post("/booking", createBooking)
  .post("/check-availablity", checkDateAvailability)
 

  .get("/booking/:id", getBooking)
  .get("/properties/category/:id", propertyByCategory);

export default app;
