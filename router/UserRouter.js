import express from "express";
import {
  allProperty,
  login,
  propertyById,
  registerUser,
} from "../controller/userController.js";
import { AllUser } from "../controller/adminController.js";
import verifyUserToken from "../middlewares/UserAuth.js";

const app = express.Router();

app
  .post("/register", registerUser)
  .post("/login", login)
  // .use(verifyUserToken)
  .get("/properties", allProperty)
  .get("/properties/:id", propertyById);

export default app;
