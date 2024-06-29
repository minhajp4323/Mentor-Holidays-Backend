import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import AdminRouter from "./router/AdminRouter.js";
import UserRouter from "./router/UserRouter.js";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3333;  
const mongodb ="mongodb+srv://minhajsam1233:mentorpass@mentor.r7t4xhq.mongodb.net/mentor-holidays";
// const mongodb = "mongodb://localhost:27017/MentorHolidays";

mongoose.connect(mongodb).then(console.log("Connected to db"));

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

app.use("/api/admin", AdminRouter);
app.use("/api/user", UserRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Something went wrong on connection");
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});
