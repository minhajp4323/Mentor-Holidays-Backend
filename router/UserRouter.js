import express from "express";
import { login, registerUser } from "../controller/userController.js";
import { AllUser } from "../controller/adminController.js";

const app = express.Router();

app
.post("/register", registerUser)
.post("/login", login)


export default app;
