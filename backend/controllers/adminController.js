const Quote = require("../models/quote");
const QuoteSequence = require("../models/quoteSequence");
const User = require("../models/user");
const {authorSlugFromAuthor} = require("../helper/authorSlugfromAuthor");
const quoteSequenceGenerator = require("../utils/quoteSequenceGenerator");

// Quotes
exports.getQuotes = async (req, res) => {
  const { page = 1, limit = 20, content, author, quoteNumberId } = req.query;
  try {
    // Construct the search query
    let searchQuery = {};
    if (content) {
      searchQuery.content = { $regex: content, $options: 'i' }; // Case-insensitive search
    }
    if (author) {
      searchQuery.author = { $regex: author, $options: 'i' }; // Case-insensitive search
    }
    if (quoteNumberId) {
      searchQuery.quoteNumberId = quoteNumberId; // Exact match for quoteNumberId
    }

    // Fetch quotes with pagination and search
    const quotes = await Quote.find(searchQuery)
      .skip((page - 1) * limit) // Skip items for the current page
      .limit(limit); // Limit the number of items per page

    // Get the total number of quotes matching the search query to calculate total pages
    const totalQuotes = await Quote.countDocuments(searchQuery);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalQuotes / limit);

    // Send response with pagination details
    res.json({
      quotes,
      pagination: {
        totalQuotes,
        totalPages,
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching quotes" });
  }
};

exports.createQuote = async (req, res) => {
  const { author, content, tags } = req.body;

  // Validate required fields
  if (!author || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const lastQuote = await Quote.findOne().sort({ quoteNumberId: -1 }).exec();
    const newQuoteNumberId = lastQuote ? lastQuote.quoteNumberId + 1 : 1; 

    // Create a new quote
    const newQuote = new Quote({
      quoteNumberId: newQuoteNumberId,
      author,
      content,
      tags: tags || [], // Default to empty array if no tags are provided
      authorSlug: authorSlugFromAuthor(author),
      length: content.length,
      dateAdded: Date.now(), // Set the dateAdded to current date
      dateModified: Date.now() // Set the dateModified to current date
    });

    // Save the new quote to the database
    await newQuote.save();

    // Respond with the created quote
    res.status(201).json(newQuote);
  } catch (error) {
    // Handle errors
    console.log(error)
    res.status(500).json({ error: "Error creating quote" });
  }
};

exports.updateQuote = async (req, res) => {
  const { quoteNumberId, author, content, tags } = req.body;

  // Validate required fields
  if (!quoteNumberId) {
    return res.status(400).json({ error: "Missing quoteNumberId" });
  }

  try {
    // Find the quote by quoteNumberId
    const quote = await Quote.findOne({ quoteNumberId });

    // Check if the quote exists
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }

    // Update the quote fields
    if (author !== undefined) {
      quote.author = author;
      quote.authorSlug = authorSlugFromAuthor(author);
    }
    if (content !== undefined) {
      quote.content = content;
      quote.length = content.length; // Update length based on new content
    }
    if (tags !== undefined) {
      quote.tags = tags;
    }

    quote.dateModified = Date.now(); // Update dateModified to current date

    // Save the updated quote to the database
    await quote.save();

    // Respond with the updated quote
    res.status(200).json(quote);
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ error: "Error updating quote" });
  }
};

exports.deleteQuote = async (req, res) => {
  const { quoteNumberId } = req.body;

  // Validate required fields
  if (!quoteNumberId) {
    return res.status(400).json({ error: "Missing quoteNumberId" });
  }

  try {
    // Find and delete the quote by quoteNumberId
    const result = await Quote.deleteOne({ quoteNumberId });

    // Check if the quote was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Quote not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ error: "Error deleting quote" });
  }
};


// Quote Sequences
exports.getQuoteSequences = async (req, res) => {
  const { page = 1, limit = 20, userEmail } = req.query; // Default to page 1 and limit 20 if not provided

  let searchQuery = {};

  if (userEmail) {
    searchQuery.userEmail = { $regex: userEmail, $options: 'i' }; // Case-insensitive search
  }
  try {
    const quoteSequences = await QuoteSequence.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await QuoteSequence.countDocuments(searchQuery);
    
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      quoteSequences
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching quote sequences" });
  }
};

exports.createQuoteSequence = async (req, res) => {
  const { userEmail, options } = req.body;

  // Validate input
  if (!userEmail || !options) {
    return res.status(400).send({ error: "userEmail and options are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const existingSequence = await QuoteSequence.findOne({ userEmail: user.email });
    if (existingSequence) {
      return res.status(400).send({ error: "User already has a quote sequence" });
    }

    // Get the total number of quotes
    const totalQuotes = await Quote.countDocuments();

    // Generate shuffled quote sequence
    const shuffledSequence = await quoteSequenceGenerator(totalQuotes);

    // Save quote sequence details
    const quoteSequence = new QuoteSequence({
      userEmail: user.email,
      quoteSequence: shuffledSequence,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await quoteSequence.save();

    // Send confirmation response
    console.log("Created a quote sequence for", user.email);
    res.status(200).send({ message: "Quote sequence created successfully" });
  } catch (error) {
    console.error("Error creating quote sequence:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteQuoteSequence = async (req, res) => {
  const { userEmail } = req.body;

  // Validate input
  if (!userEmail) {
    return res.status(400).send({ error: "userEmail is required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if quote sequence exists
    const existingSequence = await QuoteSequence.findOne({ userEmail: user.email });
    if (!existingSequence) {
      return res.status(404).send({ error: "Quote sequence not found" });
    }

    // Delete quote sequence
    await QuoteSequence.deleteOne({ userEmail: user.email });

    // Send confirmation response
    console.log("Deleted quote sequence for", user.email);
    res.status(200).send({ message: "Quote sequence deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote sequence:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

// Users
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 20, username, email } = req.query;
  
  try {
    // Construct the search query
    let searchQuery = {};
    if (username) {
      searchQuery.username = { $regex: username, $options: 'i' }; // Case-insensitive search
    }
    if (email) {
      searchQuery.email = { $regex: email, $options: 'i' }; // Case-insensitive search
    }

    // Fetch users with pagination and search
    const users = await User.find(searchQuery)
      .skip((page - 1) * limit) // Skip items for the current page
      .limit(limit); // Limit the number of items per page

    // Get the total number of users matching the search query to calculate total pages
    const totalUsers = await User.countDocuments(searchQuery);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Send response with pagination details
    res.json({
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};


exports.deleteUser = async (req, res) => {
  const { userEmail } = req.body; 
  
  try {

    if (!userEmail) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Attempt to delete the user
    const result = await User.deleteOne({ email: userEmail });

    // Check if the user was found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


