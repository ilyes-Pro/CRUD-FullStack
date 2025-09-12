import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// إعداد multer + CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prodactADD',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export const Upload = multer({ storage });

export function GetPublicId(url) {
  // الرابط: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/prodactADD/filename.jpg
  // public_id = "prodactADD/filename"
  const parts = url.split('/');
  const filenameWithExt = parts[parts.length - 1]; // filename.jpg
  const filename = filenameWithExt.split('.')[0]; // filename
  const folder = parts[parts.length - 2]; // prodactADD
  return `${folder}/${filename}`;
}
