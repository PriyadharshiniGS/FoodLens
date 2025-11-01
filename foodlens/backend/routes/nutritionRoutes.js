const express = require('express');
const Nutrition = require('../models/Nutrition');
const auth = require('../middleware/auth');
const router = express.Router();

// Add nutrition entry
router.post('/', auth, async (req, res) => {
  try {
    const { foodName, calories, date } = req.body;
    const nutrition = new Nutrition({
      userId: req.user.id,
      foodName,
      calories,
      date: new Date(date)
    });

    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's nutrition history
router.get('/', auth, async (req, res) => {
  try {
    const nutritionData = await Nutrition.find({ userId: req.user.id })
      .sort({ date: -1 });
    res.json(nutritionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
