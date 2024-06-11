import express from "express";
import {
  AllUser,
  addProperties,
  allProperties,
  login,
  propertById,
  updatePropById,
  userById,
} from "../controller/adminController.js";
import imageUpload from "../middlewares/imageuploader/imageUploader.js";
import { verifyAdminToken } from "../middlewares/AdminAuth.js";

const app = express.Router();

app
  .post("/login", login)

  .use(verifyAdminToken)

  .get("/user", AllUser)
  .get("/user/:id", userById)
  .post("/properties", imageUpload, addProperties)
  .get("/properties", allProperties)
  .get("/properties/:id", propertById)
  .put("/properties/:id", updatePropById);

export default app;
