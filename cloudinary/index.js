const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Configuration
console.log(process.env.cloud_name);
console.log(process.env.api_key);
console.log(process.env.api_secret);
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "DaycareFinder",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
