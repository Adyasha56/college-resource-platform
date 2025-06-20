// routes/testUserRoute.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

//Create a new user
router.post('/test-create-user', async (req, res) => {
  try {
    const { name, email, password, year, branch } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      year,
      branch
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error(err); //to see full error
    res.status(500).json({ message: 'Error creating user', error: err.message });

  }
});



export default router;
