require("../../db/db");
const Quote = require("../../models/quote");

(async function findQuotesWithDuplicatedTags() {
  try {
    const allQuotes = await Quote.find(); // Fetch all quotes from the database
    const quotesWithDuplicatedTags = [];

    for (const quote of allQuotes) {
      const tagCounts = {};
      let hasDuplicate = false;

      // Count occurrences of each tag in the quote
      for (const tag of quote.tags) {
        if (tagCounts[tag]) {
          tagCounts[tag]++;
          hasDuplicate = true; // Mark if a duplicate is found
        } else {
          tagCounts[tag] = 1;
        }
      }

      // If there are duplicates, log the quote
      if (hasDuplicate) {
        quotesWithDuplicatedTags.push({
          quoteId: quote._id,
          content: quote.content, 
          duplicatedTags: Object.keys(tagCounts).filter(tag => tagCounts[tag] > 1),
        });
      }
    }

    // Log or handle quotes with duplicated tags
    if (quotesWithDuplicatedTags.length > 0) {
      console.log("Quotes with duplicated tags:", quotesWithDuplicatedTags);
    } else {
      console.log("No quotes with duplicated tags found.");
    }

    return quotesWithDuplicatedTags;
  } catch (error) {
    console.error("Error finding quotes with duplicated tags:", error.name, error.message);
    return [];
  }
})()



