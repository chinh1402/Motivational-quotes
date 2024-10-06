const axios = require("axios");
const mongoose = require("mongoose");
require("../../db/db");

const Quote = require("../../models/quote");
const Tag = require("../../models/tag");

require("dotenv").config({ path: "../../.env" });

// adding toolongforwebUI and tagNames property to quotes.
async function addPropertiesToQuotes() {
    try {
        const quotes = await Quote.find();

        // Use Promise.all to handle all asynchronous operations in parallel
        const quotePromises = quotes.map(async (quote) => {
            if (quote.tags && quote.tags.length > 0) {
                // Fetch tag names based on tag IDs
                const tags = await Tag.find({ _id: { $in: quote.tags } });
                const tagNames = tags.map(tag => tag.name); // assuming each tag document has a 'name' field
                quote.tagNames = tagNames.join(", "); // convert to string format "Motivational, Success"
            } else {
                quote.tagNames = ""; // empty if no tags
            }

            // Save updated quote
            return quote.save();
        });

        // Wait for all quotes to be processed and saved
        await Promise.all(quotePromises);

        console.log("Quotes updated successfully!");
    } catch (error) {
        console.error(error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

addPropertiesToQuotes();
