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
  tagNames: {
    type: String,
    default: "",
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
  toolongforwebUI: {
    type: Boolean,
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

quoteSchema.pre('save', async function(next) {
  try {
    this.length > 150 ? this.toolongforwebUI = true : this.toolongforwebUI = false
    next();
  } catch (error) {
    next(error); 
  }
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
