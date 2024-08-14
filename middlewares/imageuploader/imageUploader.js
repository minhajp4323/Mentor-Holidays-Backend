import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDirectory = path.resolve(__dirname, "upload");

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: "356935726344889",
  api_secret: process.env.API_SECRET,
});

const imageUpload = (req, res, next) => {
  upload.array("images", 10)(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    if (!req.files) {
      return res.status(400).json({
        status: "error",
        message: "No files were uploaded.",
      });
    }
    try {
      const promises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "Property-images",
        });
        return result.secure_url;
      });
      const uploadedImages = await Promise.all(promises);
      req.body.images = uploadedImages;
      req.files.forEach((file) => {
        fs.unlink(file.path, (unlink_error) => {
          if (unlink_error) {
            console.log(
              "Error deleting local files after uploading to Cloudinary",
              unlink_error
            );
          }
        });
      });
      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({
        status: "error",
        message: "Error uploading files to Cloudinary",
      });
    }
  });
};

export default imageUpload;
