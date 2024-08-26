const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALTROUNDS = 10; // Define the number of salt rounds for bcrypt

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: Number,
    required: true,
    enum: [0, 1, 2], // 0 = female, 1 = male, 2 = unknown
    default: 2
  },
  birthDate: {
    type: Date,
  },
  country: {
    type: String,
  },
  timezone: {
    type: String,
  },
  avatarURL: {
    type: String,
  },
  favoriteQuotes: {
    type: [Number],
    required: false
  },
  role: {
    type: Number,
    required: true,
    enum: [0, 1, 2], // 0 = user authenticated, 1 = user donator authenticated, 2 = admin
    default: 0
  },
  agreedtoTOSandPrivacyPolicy: {
    type: Boolean,
    required: true,
    default: false
  },
  userSurveyData: {
    type: Number,
  },
  googleId: {
    type: String
  },
  isSignedupForEmail: {
    type: Boolean,
    default: false
  },
  tempUpdateStorage: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
  }
});

userSchema.pre('save', async function(next) {
    try {
      if (!this.password || typeof this.password !== 'string') {
        throw new Error(`Password must be provided and must be a string; but it is: ${typeof this.password}`);
      }
  
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, SALTROUNDS);
      }

      if (this.isNew) {
        // If createdBy is not manually set, default it to the user's own ObjectId
        if (!this.createdBy) {
          this.createdBy = this._id;
        }
      }
      
      // If updatedBy is not manually set, default it to the user's own ObjectId
      if (!this.updatedBy) {
        this.updatedBy = this._id;
      }
      
      next();
    } catch (error) {
      next(error); 
    }
  });

module.exports = mongoose.model('User', userSchema);
