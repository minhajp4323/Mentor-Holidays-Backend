import express from "express";
import {
  addToWishlist,
  allProperty,
  currentUser,
  getWishlist,
  login,
  payment,
  propertyById,
  registerUser,
  removeFromWishlist,
  verifyOTP,
} from "../controller/userController.js";
import verifyUserToken from "../middlewares/UserAuth.js";

const app = express.Router();

app
  .post("/register", registerUser)
  .post("/verifyotp", verifyOTP) // Add the OTP verification route
  .post("/login", login)
  // .use(verifyUserToken)
  .get("/properties", allProperty)
  .get("/properties/:id", propertyById)
  .get("/user/:id", currentUser)
  .post("/wishlist/:id", addToWishlist)
  .delete("/wishlist/:id", removeFromWishlist)
  .get("/wishlist/:id", getWishlist)
  .post("/payment", payment);

export default app;
