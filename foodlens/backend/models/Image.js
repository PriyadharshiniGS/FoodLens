const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageBase64: {
    type: String,
    required: false,
    index: false
  },
  foodName: {
    type: String,
    required: false,
    index: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  processedAt: Date,
  analysisResults: {
    type: {
      foodName: {
        type: String,
        required: false
      },
      calories: {
        type: Number,
        required: false,
        min: 0
      },
      nutrients: {
        protein: Number,
        carbs: Number,
        fat: Number
      },
      recognitionConfidence: {
        type: Number,
        min: 0,
        max: 1
      },
      processedAt: {
        type: Date,
        default: Date.now
      }
    },
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending',
    required: true
  },
  htmlContent: {
    type: String,
    required: false
  },
  uploadStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    required: true
  }



});

// Add indexes for faster queries
ImageSchema.index({ userId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Image', ImageSchema);
