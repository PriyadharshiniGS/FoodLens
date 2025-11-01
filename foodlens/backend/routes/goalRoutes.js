const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new goal
router.post('/', auth, async (req, res) => {
  try {
    console.log('POST /api/goals route called');
    const { targetCalories, startDate, endDate } = req.body;

    const goal = new Goal({
      userId: req.user.id,
      goalType: 'calorie',
      target: targetCalories,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's goals
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
      .sort({ startDate: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
