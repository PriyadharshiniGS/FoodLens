const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  calorieGoal: {
    type: Number,
    default: 2000
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  }
});

// Add indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });




// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
