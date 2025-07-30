import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";


import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; //in config/db.js
import dotenv from 'dotenv';
dotenv.config();

import testUserRoute from './routes/testUserRoute.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend origin
  credentials: true,                // allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // headers frontend sends
}));

// Optional: handle preflight requests explicitly
app.options('*', cors());



// Routes
app.use('/api/test', testUserRoute);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/downloads', downloadRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});


// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});