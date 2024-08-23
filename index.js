import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import AdminRouter from "./router/AdminRouter.js";
import UserRouter from "./router/UserRouter.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

const mongodb = process.env.MONGODB_URI || "mongodb://localhost:27017/MentorHolidays";

mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to db"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

app.use(express.json());
app.use(
  cors({
    origin: "https://mentor-holidays-frontend.vercel.app",
    methods: ["POST", "GET", "PATCH", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/admin", AdminRouter);
app.use("/api/user", UserRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Something went wrong on connection");
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});
