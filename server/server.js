import express from 'express';
import connectDB from './config/db.js'; //in config/db.js
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
import testUserRoute from './routes/testUserRoute.js';
app.use('/api/test', testUserRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
