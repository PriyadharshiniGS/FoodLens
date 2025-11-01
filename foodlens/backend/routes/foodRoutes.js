const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const recognizeFood = require("../services/foodRecognition.js");
const getNearbyHealthyOptions = require("../services/locationService.js");
const User = require("../models/User.js");
const Image = require("../models/Image.js");
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Helper function to validate HTML content
const validateHTMLContent = (htmlContent) => {
  if (!htmlContent) return true;
  
  // Basic HTML validation
  if (typeof htmlContent !== 'string') return false;
  if (htmlContent.length > 5000000) return false; // 5MB limit
  
  // Add more validation as needed
  return true;
};

// Enhanced uploadImage route
router.post("/uploadImage", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, imageBase64, foodName, htmlContent } = req.body;

    // Validate inputs
    if (!userId) {
      throw new Error('Missing userId');
    }
    if (!imageBase64 && !foodName && !htmlContent) {
      throw new Error('At least one of imageBase64, foodName, or htmlContent must be provided');
    }
    if (!validateHTMLContent(htmlContent)) {
      throw new Error('Invalid HTML content');
    }

    // Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    // Create new image document
    const newImage = new Image({
      userId,
      imageBase64: imageBase64 || null,
      foodName: foodName || null,
      htmlContent: htmlContent || null,
      uploadStatus: 'pending'
    });

    // Save with transaction
    const savedImage = await newImage.save({ session });

    // Update user's image references
    user.images.push(savedImage._id);
    await user.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Image data successfully added to DB",
      imageId: savedImage._id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Upload error:", error);
    
    return res.status(500).json({
      error: "Failed to upload image",
      code: "UPLOAD_FAILED",
      details: error.message
    });
  }
});

// Other routes remain unchanged...

module.exports = router;
