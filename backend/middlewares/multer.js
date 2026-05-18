import multer from "multer";

// Use memoryStorage instead of diskStorage so files are not saved to the local disk.
// The file is kept in memory (buffer) and then uploaded directly to Cloudinary.
const storage = multer.memoryStorage();

// Create upload instance limit 5MB
export const singleUpload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single("file");
