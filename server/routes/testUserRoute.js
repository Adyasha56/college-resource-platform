const express = require('express');
const router = express.Router();
const User = require('../models/User');

// TEST ROUTE: Create a new user
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
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

module.exports = router;
