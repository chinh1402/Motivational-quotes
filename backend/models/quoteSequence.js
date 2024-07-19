const mongoose = require('mongoose');

const quoteSequenceSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  quoteSequence: {
    type: [Number], 
    required: true,
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
  currentDay: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserQuotePattern = mongoose.model('quoteSequence', quoteSequenceSchema);

module.exports = UserQuotePattern;
