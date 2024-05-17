import express from "express";
import {
  AllUser,
  addProperties,
  login,
  userById,
} from "../controller/adminController.js";

const app = express.Router();

app
  .post("/login", login)
  .get("/user", AllUser)
  .get("/user/:id", userById)
  .post("/properties", addProperties);

export default app;
