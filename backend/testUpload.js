import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {

  const result =
    await cloudinary.uploader.upload(
      "./uploads/1780746792507-Screenshot 2025-10-10 124151.png"
    );

  console.log(result.secure_url);

} catch (error) {

  console.log(error);

}