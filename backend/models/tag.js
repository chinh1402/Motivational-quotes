const mongoose = require('mongoose');

// Define the Tags Schema
const TagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  quoteList: {
    type: [Number],
    required: false,
    default: []
  },
  quoteCount: {
    type: Number,
    required: false,
    default: 0
  },
  quoteSequenceCount: {
    type: Number,
    required: false,
    default: 0
  },
  relatedTags: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: []
  },
  relatedTagsNames: {
    type: String,
    required: false,
    default: ""
  },
  color: {
    type: String,
    required: false
  },
  icon: {
    type: String,
    required: false
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

// Create the model from the schema and export it
const Tag = mongoose.model('Tag', TagsSchema);

module.exports = Tag;
