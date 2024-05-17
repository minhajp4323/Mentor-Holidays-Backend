import multer from "multer";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (uploadDirectory = path.resolve(__dirname, "upload")),
});

const uploadStorage = multer({ storage: storage });
