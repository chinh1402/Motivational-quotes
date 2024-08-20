const mongoose = require("mongoose");
const languageSchema = require("./language")

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
    type: [mongoose.Schema.Types.ObjectId],
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
  favorites: {
    type: Number,
    default: 0
  },
  language: {
    type: [languageSchema],
    required: true,
    default: []
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


const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
