// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

// Then import everything else
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import testUserRoute from './routes/testUserRoute.js'; 
import recommendationRoutes from "./routes/recommendationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',  // Use env variable
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Optional: handle preflight requests explicitly
app.options('*', cors());

// Routes
app.use('/api/test', testUserRoute);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/questionpapers", questionRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/downloads', downloadRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});