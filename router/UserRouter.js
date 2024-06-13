import express from "express";
import {
  addToWishlist,
  allProperty,
  currentUser,
  getWishlist,
  login,
  propertyById,
  registerUser,
} from "../controller/userController.js";
import verifyUserToken from "../middlewares/UserAuth.js";

const app = express.Router();

app
  .post("/register", registerUser)
  .post("/login", login)
  // .use(verifyUserToken)
  .get("/properties", allProperty)
  .get("/properties/:id", propertyById)
  .get("/user/:id", currentUser)
  .post("/wishlist/:id", addToWishlist)
  .get("/user/:id/wishlist", getWishlist);

export default app;
