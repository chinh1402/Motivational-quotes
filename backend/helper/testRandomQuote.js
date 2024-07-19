const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Adjust the base URL as needed
const RANDOM_QUOTE_ENDPOINT = '/random-quote'; // Endpoint for fetching random quote

async function testRandomQuote() {
  const usedQuotes = new Set();

  // Track the number of unique quotes received
  let uniqueQuotesCount = 0;

  try {
    for (let i = 0; i < 2500; i++) { // Adjust the number of iterations as needed
      const response = await axios.get(`${BASE_URL}${RANDOM_QUOTE_ENDPOINT}`);
      const quote = response.data;

      if (!quote || !quote.text) {
        console.log(`Error: Received invalid quote at iteration ${i}`);
        continue;
      }

      if (usedQuotes.has(quote.text)) {
        console.log(`Duplicate quote found after ${uniqueQuotesCount} unique quotes: "${quote.text}"`);
        break;
      }

      usedQuotes.add(quote.text);
      uniqueQuotesCount++;

      console.log(`Iteration ${i + 1}: "${quote.text}" by ${quote.author}`);
    }

    console.log(`Test completed. Total unique quotes received: ${uniqueQuotesCount}`);
  } catch (error) {
    console.error('Error testing randomQuote API:', error);
  }
}

testRandomQuote();
