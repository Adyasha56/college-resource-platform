import dotenv from 'dotenv';
import connectDB from './config/db.js';

const express = require('express');
const cors = require('cors');

dotenv.config();
connectDB();


//test user
const testUserRoute = require('./routes/testUserRoute')




require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

;
app.use('/api/test', testUserRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
