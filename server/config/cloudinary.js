// config/cloudinary.js - FIXED VERSION
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary Config Loaded:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY?.substring(0, 4) + '***');
console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);

// Test the connection
try {
  await cloudinary.api.ping();
  console.log('✅ Cloudinary connection successful');
} catch (error) {
  console.error('❌ Cloudinary connection failed:', error.message);
}

// Cloudinary storage for question papers
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'question-papers', // Folder name in Cloudinary
    allowed_formats: ['pdf', 'doc', 'docx'], // Allowed file formats
    resource_type: 'raw', // For non-image files like PDFs
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${timestamp}`;
    },
  },
});

// Multer middleware
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
    }
  }
});

export default cloudinary;