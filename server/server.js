import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import placementRoutes from './routes/placementRoutes.js';

import express from 'express';
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

// Routes
app.use('/api/test', testUserRoute);
app.use('/api/auth', authRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/placements', placementRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});


// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
