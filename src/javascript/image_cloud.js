const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: "dvshfvk1u", // Your cloud name from Cloudinary
    api_key: "646567131355832",       // Your API key
    api_secret: "flq7hSmbTy4OVDy11s1WjxCWD0k", // Your API secret
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Auction_System',  // Folder where images will be stored
        allowed_formats: ['jpg', 'jpeg', 'png'],  // Allowed image formats
        transformation: [{ width: 500, height: 500, crop: 'limit' }],  // Optional: Resize and crop the images
    },
});

// Create a Multer instance to handle file uploads
const upload = multer({ storage: storage });

module.exports = {
    cloudinary,
    upload
};
