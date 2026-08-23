import multer from "multer";
import path from "path";
import fs from "fs";

// const uploadDir = path.join(process.cwd(), "src", "asset");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/asset');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); 

    const finalFilename = file.fieldname + "-" + uniqueSuffix + fileExtension;
    
    cb(null, finalFilename);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
