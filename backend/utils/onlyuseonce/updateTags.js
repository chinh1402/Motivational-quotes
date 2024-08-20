// First you run fetchQuotev2.js first
// then you run this to update Tags

const mongoose = require("mongoose");
require("../../db/db");

const Quote = require("../../models/quote");
const Tag = require("../../models/tag");

require("dotenv").config({path:'../../.env'});

async function updateTags() {
    try {
      const tags = await Tag.find(); // Get all tags
      for (const tag of tags) {
        const quotesWithTag = await Quote.find({ tags: tag._id }); // Find all quotes with this tag
        const quoteIds = quotesWithTag.map(quote => quote.quoteNumberId); // Get the quoteNumberIds
  
        // Update the tag's quotes_list and quotes_count
        tag.quotes_list = quoteIds;
        tag.quotes_count = quoteIds.length;
        tag.createdBy = process.env.GOD_USER; // Update the updatedBy field
        tag.updatedBy = process.env.GOD_USER; // Update the updatedBy field
  
        await tag.save(); // Save the updated tag
      }
      console.log('Tags updated successfully.');
    } catch (error) {
      console.error('Error updating tags:', error.name, error.message);
    } finally {
      mongoose.connection.close();
    }
}

updateTags()