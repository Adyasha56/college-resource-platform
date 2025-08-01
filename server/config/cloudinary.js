// config/cloudinary.js - TEMPORARY HARDCODED VERSION
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Temporary hardcoded config for testing
cloudinary.config({
  cloud_name: 'dvg6kkxr3',
  api_key: '875425665332915',
  api_secret: '_wC2YG-JSGg9bxMomOejO4G0pQw',
});

console.log('🔧 Cloudinary Config (Hardcoded):');
console.log('Cloud Name: dvg6kkxr3');
console.log('API Key: 875425665332915');
console.log('API Secret exists: true');

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