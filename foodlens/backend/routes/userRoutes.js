const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, calorieGoal } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    // Create new user and save
    const newUser = new User({ name, email, password, calorieGoal });
    await newUser.save();

    // Generate token for new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Add token to user's tokens array
    newUser.tokens = newUser.tokens.concat({ token });
    await newUser.save();

    res.status(201).json({ 
      message: 'Signup successful', 
      token, 
      user: { 
        name: newUser.name, 
        email: newUser.email, 
        calorieGoal: newUser.calorieGoal 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Add token to user's tokens array
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.json({ 
      token, 
      user: { 
        name: user.name, 
        email: user.email, 
        calorieGoal: user.calorieGoal 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
