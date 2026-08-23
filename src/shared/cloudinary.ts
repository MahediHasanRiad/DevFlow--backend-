import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET_KEY } = process.env;

if (!CLOUDINARY_NAME || !CLOUDINARY_KEY || !CLOUDINARY_SECRET_KEY) {
  throw new Error(
    "Missing Cloudinary env vars: CLOUDINARY_NAME, CLOUDINARY_KEY, or CLOUDINARY_SECRET_KEY",
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

export const CloudinaryFileUpload = async (localFilePath: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    fs.unlinkSync(localFilePath);
    return uploadResult.url;
  } 
  catch (error) {
    console.error("Cloudinary upload failed:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error;
  }
};
