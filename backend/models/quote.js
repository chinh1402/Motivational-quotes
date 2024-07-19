const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  quoteNumberId: {
    type: Number,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  authorSlug: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
});


const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
