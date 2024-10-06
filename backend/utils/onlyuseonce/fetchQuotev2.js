// Fetching 2127 quotes from api.quotable.io to mongodb

// Vietnam DNS can't find api.quotable.io, so you gotta use a VPN

// Each quote has it own tag, it might not have any tag. Everytime there's a new tag, create a
// record for it

// While that is happening, You save quotes, but with tag objectid for that.

const axios = require("axios");
const mongoose = require("mongoose");
require("../../db/db");

const Quote = require("../../models/quote");
const Tag = require("../../models/tag");

require("dotenv").config({path:'../../.env'});

async function fetchQuotes() {
  try {
    let page = 1;
    let quotes = [];
    let totalQuotes = 0;
    let inc_id = 1;

    while (quotes.length < 5000) {
      const response = await axios.get(
        `https://api.quotable.io/quotes?page=${page}&limit=100`
      );
      const newQuotes = await Promise.all(
        response.data.results.map(async (quote) => {
          const tagIds = await Promise.all(
            quote.tags.map(async (tagName) => {
              let tag = await Tag.findOne({ name: tagName });
      
              if (!tag) {
                // Use an atomic operation to prevent race conditions
                tag = await Tag.findOneAndUpdate(
                  { name: tagName },
                  {
                    $setOnInsert: {
                      name: tagName,
                      description: "",
                      relatedTags: [],
                      color: "",
                      icon: "",
                      createdBy: process.env.GOD_USER,
                      updatedBy: process.env.GOD_USER,
                    }
                  },
                  { new: true, upsert: true }
                );
              }
      
              return tag._id;
            })
          );
      
          return {
            quoteNumberId: inc_id++,
            author: quote.author,
            content: quote.content,
            tags: tagIds,
            authorSlug: quote.authorSlug,
            length: quote.content.length,
            createdBy: process.env.GOD_USER,
            updatedBy: process.env.GOD_USER,
          };
        })
      );

      if (newQuotes.length === 0) {
        console.log("No more quotes available from API.");
        break;
      }

      quotes = quotes.concat(newQuotes);
      totalQuotes += newQuotes.length;

      // Log the progress
      console.log(`Fetched ${totalQuotes} quotes so far (Page ${page})`);

      page++;
    }

    // Save quotes to MongoDB
    if (quotes.length > 0) {
      await Quote.insertMany(quotes);
      console.log("Quotes saved to MongoDB");
    } else {
      console.log("No quotes to save.");
    }
  } catch (error) {
    console.error("Error fetching quotes:", error.name, error.message);
  } finally {
    mongoose.connection.close();
  }
}

fetchQuotes();