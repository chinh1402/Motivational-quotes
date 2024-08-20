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
  sequence_type: {
    type: String
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  timezone: {
    type: String,
    required: true,
    default: "UTC"
  },
  start_sending_day: {
    type: Date,
    required: true,
    default: Date.now
  },
  last_sending_day: {
    type: Date,
    required: true
  },
  send_daily_at: {
    type: String, // Storing time as a string, e.g., "12:00AM"
    required: true
  },
  on_halt: {
    type: Boolean,
    required: true,
    default: false
  },
  user_consent: {
    type: Boolean,
    default: false
  },
  current_day: {
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
