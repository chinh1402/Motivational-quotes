const mongoose = require('mongoose');

const quoteSequenceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  quoteSequence: {
    type: [Number], 
    required: true,
  },
  sequenceType: {
    type: String
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  tagNames: {
    type: String,
    default: "",
  },
  timezone: {
    type: String,
    required: true,
    default: "UTC"
  },
  startSendingDay: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastSendingDay: {
    type: Date,
    required: true
  },
  sendAt: {
    type: String, // Storing time as a string, e.g., "12:00AM"
    required: true
  },
  mailServiceRunning: {
    type: Boolean,
    required: true,
    default: false
  },
  userConsent: {
    type: Boolean,
    default: false
  },
  // currentDay
  currentDay: {
    type: Number,
    required: true,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const UserQuotePattern = mongoose.model('quoteSequence', quoteSequenceSchema);

module.exports = UserQuotePattern;
