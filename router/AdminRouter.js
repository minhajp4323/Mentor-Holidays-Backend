import express from "express";
import {
  AllUser,
  addPackage,
  addProperties,
  // allPackages,
  allProperties,
  deleteProperty,
  getAllBooking,
  getPropertyRevenue,
  getRevenueByPaymentDate,
  login,
  propertById,
  totalRevenue,
  updatePropById,
  userById,
} from "../controller/adminController.js";
import imageUpload from "../middlewares/imageuploader/imageUploader.js";

import { verifyAdminToken } from "../middlewares/AdminAuth.js";

const app = express.Router();

app
  .post("/login", login)

  // .use(verifyAdminToken)

  .get("/user", AllUser)
  .get("/user/:id", userById)
  .post("/properties", imageUpload, addProperties)
  .get("/properties", allProperties)
  .get("/properties/:id", propertById)
  .put("/properties/:id", imageUpload, updatePropById)
  .delete("/properties/:id", deleteProperty)
  .get("/bookings", getAllBooking)
  .get("/total-revenue", totalRevenue)
  .get("/property-revenue", getPropertyRevenue)
  .get("/revenue", getRevenueByPaymentDate)
  //pakages
  .post("/package", imageUpload, addPackage)
  // .get("/package", allPackages);

export default app;
