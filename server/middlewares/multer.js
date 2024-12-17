import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("'uploads' directory created successfully");
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log("Multer storage destination called"); // Debugging
        cb(null, uploadDir); // Use absolute path
    },
    filename(req, file, cb) {
        const id = uuid();
        const extName = file.originalname.split('.').pop();
        const fileName = `${id}.${extName}`;
        console.log("Multer storage filename called", fileName); // Debugging
        cb(null, fileName);
    }
});

export const uploadFiles = multer({ storage }).single("file");
