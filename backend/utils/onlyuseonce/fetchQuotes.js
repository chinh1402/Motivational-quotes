// Fetching 2127 quotes from api.quotable.io to mongodb

// Vietnam DNS can't find api.quotable.io, so you gotta use a VPN 

const axios = require('axios');
const mongoose = require('mongoose');
require('../../db/db');

// Old schema where tags is an array of String
const Quote = require("../../models/quote");

async function fetchQuotes() {
  try {
    let page = 1;
    let quotes = [];
    let totalQuotes = 0;
    let inc_id = 1;

    while (quotes.length < 5000) {
      const response = await axios.get(`https://api.quotable.io/quotes?page=${page}&limit=100`);
      const newQuotes = response.data.results.map((quote) => ({
        quoteNumberId: inc_id++, 
        author: quote.author,
        content: quote.content,
        tags: quote.tags || [], 
        authorSlug: quote.authorSlug, 
        length: quote.content.length,
        dateAdded: new Date(),
        dateModified: new Date(),
      }));

      if (newQuotes.length === 0) {
        console.log('No more quotes available from API.');
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
      await Quote.insertMany(quotes.slice(0));
      console.log('Quotes saved to MongoDB');
    } else {
      console.log('No quotes to save.');
    }
  } catch (error) {
    console.error('Error fetching quotes:', error.name, error.message);
  } finally {
    mongoose.connection.close();
  }
}

fetchQuotes();