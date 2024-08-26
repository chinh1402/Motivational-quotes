const Quote = require("../models/quote");
const QuoteSequence = require("../models/quoteSequence");
const User = require("../models/user");
const Tag = require("../models/tag");
const { authorSlugFromAuthor } = require("../helper/authorSlugfromAuthor");
const quoteSequenceGenerator = require("../utils/quoteSequenceGenerator");
const dupicatorCheck = require("../utils/levenshteinDuplicateQuote");
const validateSignUpInput = require("../utils/signupValidator");
require("dotenv").config();
// Quotes
exports.getQuotes = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    content,
    author,
    quoteNumberId,
    tags,
  } = req.query;
  try {
    // Construct the search query
    let searchQuery = {};
    if (content) {
      searchQuery.content = { $regex: content, $options: "i" }; // Case-insensitive search
    }
    if (author) {
      searchQuery.author = { $regex: author, $options: "i" }; // Case-insensitive search
    }
    if (quoteNumberId) {
      searchQuery.quoteNumberId = quoteNumberId; // Exact match for quoteNumberId
    }
    // tags is string
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Split the string by commas and trim whitespace
      const tagObjects = await Tag.find({ name: { $in: tagsArray } });
      searchQuery.tags = { $all: tagObjects }; // Match documents where tags contain all of the specified tags
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
        perPage: limit,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching quotes" });
  }
};

exports.createQuote = async (req, res) => {
  const { author, content, tags } = req.body;

  if (!req.user) {
    return res.status(401).json({
      error:
        "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
    });
  }
  // Validate required fields. Tags can be null
  if (!author || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get all quotes
    const allQuotes = await Quote.find();
    let similarQuote = null;

    for (const quote of allQuotes) {
      if (dupicatorCheck(content, quote)) {
        similarQuote = quote;
        break;
      }
    }

    if (similarQuote) {
      return res
        .status(400)
        .json({ error: "A similar quote already exists", similarQuote });
    }

    const lastQuote = await Quote.findOne().sort({ quoteNumberId: -1 }).exec();
    const newQuoteNumberId = lastQuote ? lastQuote.quoteNumberId + 1 : 1;

    let tagObjects;
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Split the string by commas and trim whitespace

      // Array of tag IDs
      tagObjects = await Tag.find({ name: { $in: tagsArray } });

      tagObjects.forEach(async (tagObject) => {
        tagObject.quotes_list.push(newQuoteNumberId);
        tagObject.quotes_count += 1;
        tagObject.updatedBy = req.user._id;
        await tagObject.save();
      });
    }

    // This thing only works if you signed up, cause it need ObjectID from createdBy and updatedBy.
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    // Create a new quote
    const newQuote = new Quote({
      quoteNumberId: newQuoteNumberId,
      author,
      content,
      tags: tagObjects,
      authorSlug: authorSlugFromAuthor(author),
      length: content.length,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    // Save the new quote to the database
    await newQuote.save();

    // Respond with the created quote
    res.status(201).json(newQuote);
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ error: "Error creating quote" });
  }
};

exports.updateQuote = async (req, res) => {
  const { quoteNumberId, author, content, tags } = req.body;

  // Validate required fields
  if (!quoteNumberId) {
    return res.status(400).json({
      error:
        "Missing quoteNumberId, Can't Identify quote that's needed to update",
    });
  }

  try {
    // Find the quote by quoteNumberId
    const quote = await Quote.findOne({ quoteNumberId });

    // Check if the quote exists
    if (!quote) {
      return res
        .status(404)
        .json({ error: "Quote not found, may you refresh site" });
    }

    // Update the quote fields
    if (author !== undefined) {
      quote.author = author;
      quote.authorSlug = authorSlugFromAuthor(author);
    }
    if (content !== undefined) {
      const allQuotes = await Quote.find();
      // Check for a similar quote
      let similarQuote = null;

      for (const quote of allQuotes) {
        if (dupicatorCheck(content, quote)) {
          similarQuote = quote;
          break;
        }
      }

      if (similarQuote) {
        return res
          .status(400)
          .json({ error: "A similar quote already exists", similarQuote });
      }
      quote.content = content;
      quote.length = content.length; // Update length based on new content
    }

    // Frontend should add tags as "" instead of not passing anything
    if (tags !== undefined) {
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Split the string by commas and trim whitespace
      modifiedTagObjects = await Tag.find({ name: { $in: tagsArray } });

      // Updating tags
      for (const tagObject of modifiedTagObjects) {
        if (!quote.tags.includes(tagObject._id.toString())) {
          // Convert ObjectID to string for comparison
          tagObject.quotes_list.push(quoteNumberId);
          tagObject.quotes_count += 1;
          tagObject.updatedBy = req.user._id;
          await tagObject.save();
        }
      }

      const oldTagObjects = await Tag.find({ _id: { $in: quote.tags } });

      for (const tagObject of oldTagObjects) {
        if (
          !modifiedTagObjects.some(
            (modTag) => modTag._id.toString() === tagObject._id.toString()
          )
        ) {
          const index = tagObject.quotes_list.indexOf(quoteNumberId);
          if (index !== -1) {
            tagObject.quotes_list.splice(index, 1);
            tagObject.quotes_count -= 1;
            tagObject.updatedBy = req.user._id;
            await tagObject.save();
          }
        }
      }

      quote.tags = modifiedTagObjects.map((tagObj) => tagObj._id); // Save only the ObjectIDs
    }

    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    quote.updatedAt = Date.now(); // Update dateModified to current date
    quote.updatedBy = req.user._id;

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
    const quote = await Quote.findOne({ quoteNumberId });

    if (quote) {
      if (!req.user) {
        return res.status(401).json({
          error:
            "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
        });
      }
      const tagsObjectIDsArr = quote.tags;
      const tagObjects = await Tag.find({ _id: { $in: tagsObjectIDsArr } });

      tagObjects.forEach(async (tagObject) => {
        let index = tagObject.quotes_list.indexOf(quoteNumberId);
        if (index !== -1) {
          tagObject.quotes_list.splice(index, 1);
          tagObject.quotes_count -= 1;
          tagObject.updatedBy = req.user._id;
          await tagObject.save();
        }
      });
    }

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
  const {
    page = 1,
    limit = 20,
    email,
    sequenceType,
    tags,
    timezone,
    sendAt,
    startDate,
    lastDate,
  } = req.query; // Default to page 1 and limit 20 if not provided

  let searchQuery = {};

  // Case-insensitive search for email
  if (email) {
    searchQuery.email = { $regex: email, $options: "i" };
  }

  // Exact match for sequenceType
  if (sequenceType) {
    searchQuery.sequenceType = sequenceType;
  }

  // Tags should contain all specified tags (assuming tags is a comma-separated string)
  if (tags) {
    searchQuery.tags = { $all: tags.split(",") };
  }

  // Exact match for timezone
  if (timezone) {
    searchQuery.timezone = { $regex: timezone, $options: "i" };
  }

  // Search for records sent at a specific time (exact match)
  if (sendAt) {
    searchQuery.sendAt = sendAt;
  }

  if (startDate) {
    searchQuery.startDate = startDate;
  }

  if (lastDate) {
    searchQuery.lastDate = lastDate;
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
      quoteSequences,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching quote sequences" });
  }
};

exports.createQuoteSequence = async (req, res) => {
  const {
    email,
    sequenceType,
    tags,
    timezone,
    startSendingDay,
    lastSendingDay,
    sendAt,
  } = req.body;

  // Validate input
  if (
    !email ||
    !sequenceType ||
    !timezone ||
    !startSendingDay ||
    !lastSendingDay ||
    !sendAt
  ) {
    return res
      .status(400)
      .send({ error: "All required fields must be provided" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if the user is already signed up for the email service
    const existingSequence = await QuoteSequence.findOne({
      email: user.email,
    });
    if (existingSequence) {
      return res.status(400).send({
        error:
          "User already signed up for email service, cancel current service first.",
      });
    }

    let quoteSequence;
    if (sequenceType === "daily") {
      // Fetch the Admin's daily sequence
      const dailySequence = await QuoteSequence.findOne({
        email: process.env.ADMIN_EMAIL,
      });
      if (!dailySequence) {
        return res.status(404).send({
          error:
            "Daily sequence for Admin not found, please follow the guidelines in notes.txt",
        });
      }

      // Create a new quote sequence for the user
      quoteSequence = new QuoteSequence({
        email: user.email,
        quoteSequence: dailySequence.quoteSequence,
        sequenceType: "daily",
        tags: dailySequence.tags,
        currentDay: dailySequence.currentDay,
        start_sending_day: new Date(startSendingDay),
        last_sending_day: new Date(lastSendingDay),
        timezone,
        send_daily_at: sendAt,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });
      await quoteSequence.save();

      // Increment the quoteSequence_count for the associated tags
      const tagObjects = await Tag.find({ _id: { $in: dailySequence.tags } });
      for (const tag of tagObjects) {
        tag.quoteSequence_count += 1;
        await tag.save();
      }
    } else if (sequenceType === "random") {
      // Handle tags if provided
      let tagIds = [];
      if (tags) {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        const tagObjects = await Tag.find({ name: { $in: tagArray } });
        tagIds = tagObjects.map((tag) => tag._id);

        // Increment the quoteSequence_count for the associated tags
        for (const tag of tagObjects) {
          tag.quoteSequence_count += 1;
          await tag.save();
        }
      }

      // Fetch possible quote IDs based on tags
      let possibleQuotesNumberId = await Quote.distinct("quoteNumberId", {
        tags: { $in: tagIds },
        toolongforwebUI: false,
      });

      // If no quotes are found, get all quote IDs
      if (possibleQuotesNumberId.length === 0) {
        possibleQuotesNumberId = await Quote.distinct("quoteNumberId");
      }

      // Generate a shuffled quote sequence
      const shuffledSequence = await quoteSequenceGenerator(
        possibleQuotesNumberId
      );

      // Create a new quote sequence for the user
      quoteSequence = new QuoteSequence({
        email: user.email,
        quoteSequence: shuffledSequence,
        sequence_type: sequenceType,
        tags: tagIds,
        timezone,
        start_sending_day: new Date(startSendingDay),
        last_sending_day: new Date(lastSendingDay),
        send_daily_at: sendAt,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });
      await quoteSequence.save();
    }

    // Mark the user as signed up for the email service
    user.isSignedupForEmail = true;
    await user.save();

    // Send confirmation response
    console.log("Created a quote sequence for", user.email);
    res
      .status(200)
      .send({ message: "Quote sequence created successfully", quoteSequence });
  } catch (error) {
    console.error("Error creating quote sequence:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.updateQuoteSequence = async (req, res) => {
  const {
    _id,
    email,
    sequenceType,
    timezone,
    startSendingDay,
    lastSendingDay,
    sendAt,
    onHalt,
  } = req.body;
  // sendAt is a string that looks like this: 10:17, 22:17, 00:01, 23:59

  // Validate input
  if (
    !_id ||
    !email ||
    !sequenceType ||
    !timezone ||
    !startSendingDay ||
    !lastSendingDay ||
    !sendAt ||
    !onHalt
  ) {
    return res
      .status(400)
      .send({ error: "All required fields must be provided" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Find the existing quote sequence
    const existingSequence = await QuoteSequence.findOne({ _id });

    if (!existingSequence) {
      return res.status(404).send({ error: "Quote sequence not found" });
    }

    // Update the existing quote sequence details
    existingSequence.timezone = timezone;
    existingSequence.last_sending_day = new Date(lastSendingDay);
    existingSequence.send_daily_at = sendAt;
    existingSequence.on_halt = onHalt || false;
    existingSequence.updatedBy = req.user._id;

    await existingSequence.save();

    // Send confirmation response
    console.log("Updated the quote sequence for", user.email);
    res.status(200).send({ message: "Quote sequence updated successfully" });
  } catch (error) {
    console.error("Error updating quote sequence:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteQuoteSequence = async (req, res) => {
  const { _id } = req.body;

  // Validate input
  if (!_id) {
    return res.status(400).send({ error: "_id is required" });
  }

  try {
    // Check if quote sequence exists
    const existingSequence = await QuoteSequence.findOne({ _id });
    if (!existingSequence) {
      return res.status(404).send({ error: "Quote sequence not found" });
    }

    if (existingSequence.tags.length > 0) {
      const tagObjects = await Tag.find({
        _id: { $in: existingSequence.tags },
      });
      // Update the tags
      for (const tagObject of tagObjects) {
        tagObject.quoteSequence_count -= 1;
        await tagObject.save();
      }
    }

    const user = await User.findOne({ email: existingSequence.email });

    // Update user sign up for Email status
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.isSignedupForEmail = false;
    await user.save();

    // Delete quote sequence
    await QuoteSequence.deleteOne({ _id });
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
  const {
    page = 1,
    limit = 20,
    username,
    email,
    phone,
    country,
    timezone,
    firstName,
    lastName,
    gender,
    avatarURL,
    birthDate,
  } = req.query;

  try {
    // Construct the search query
    let searchQuery = {};

    if (username) {
      searchQuery.username = { $regex: username, $options: "i" };
    }
    if (email) {
      searchQuery.email = { $regex: email, $options: "i" };
    }
    if (phone) {
      searchQuery.phone = { $regex: phone, $options: "i" };
    }
    if (country) {
      searchQuery.country = { $regex: country, $options: "i" };
    }
    if (timezone) {
      searchQuery.timezone = { $regex: timezone, $options: "i" };
    }
    if (firstName) {
      searchQuery.firstName = { $regex: firstName, $options: "i" };
    }
    if (lastName) {
      searchQuery.lastName = { $regex: lastName, $options: "i" };
    }
    if (gender) {
      searchQuery.gender = gender;
    }
    if (avatarURL) {
      searchQuery.avatarURL = { $regex: avatarURL, $options: "i" };
    }
    if (birthDate) {
      searchQuery.birthDate = new Date(birthDate);
    }

    const users = await User.find(searchQuery)
      .skip((page - 1) * limit) // Skip items for the current page
      .limit(limit); // Limit the number of items per page

    const totalUsers = await User.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.createUser = async (req, res) => {
  const {
    username,
    email,
    password = process.env.SUPER_SECRET_PASSWORD,
    phone,
    firstName,
    lastName,
    gender = 2,
    role = 0,
    country,
    timezone,
    avatarURL,
    birthDate,
  } = req.body;

  // Validate required fields
  const responseErrorMessage = validateSignUpInput(username, password, email);
  if (responseErrorMessage) {
    return res.status(400).json({ error: responseErrorMessage });
  }

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email is already in use" });
      } else if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is already in use" });
      }
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      phone,
      firstName,
      lastName,
      gender,
      role,
      country,
      timezone,
      avatarURL,
      birthDate,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await newUser.save();

    // Send a success response
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUsers = async (req, res) => {
  const {
    _id,
    email,
    username,
    phone,
    country,
    timezone,
    firstName,
    lastName,
    gender,
    avatarURL,
    birthDate,
  } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    // Construct the update query
    let updateFields = {};

    if (email) {
      // Check if email is already used by another user
      const existingUser = User.findOne({ email, _id: { $ne: _id } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      updateFields.email = email;
    }
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: _id } });
      if (existingUser) {
        return res.status(400).json({ error: "username is already in use" });
      }
      updateFields.username = username;
    }
    if (phone) {
      updateFields.phone = phone;
    }
    if (country) {
      updateFields.country = country;
    }
    if (timezone) {
      updateFields.timezone = timezone;
    }
    if (firstName) {
      updateFields.firstName = firstName;
    }
    if (lastName) {
      updateFields.lastName = lastName;
    }
    if (gender) {
      updateFields.gender = gender;
    }
    if (avatarURL) {
      updateFields.avatarURL = avatarURL;
    }
    if (birthDate) {
      updateFields.birthDate = new Date(birthDate);
    }

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    let updatedUser = await User.findOneAndUpdate({ _id: _id }, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send response with the updated user details
    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { _id } = req.body;

  try {
    if (!_id) {
      return res.status(400).json({ error: "Id is required" });
    }

    
    //@ts-check
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Delete related quoteSequences. One user can only have one email
    await QuoteSequence.deleteOne({ email: user.email });

    // Delete related quotes fav data, also update the Quotes related statistic value
    const favoritequotes = await Quote.find({
      quoteNumberId: { $in: user.favoriteQuotes },
    });
    // fav number
    for (const quote of favoritequotes) {
      quote.favorites -= 1;
      await quote.save();
    }

    const result = await User.deleteOne({ _id });

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

// Tags
exports.getTags = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    name,
    description,
    relatedTags,
    color,
    icon,
  } = req.query;
  try {
    // Construct the search query
    let searchQuery = {};
    if (name) {
      searchQuery.name = { $regex: name, $options: "i" };
    }
    if (description) {
      searchQuery.description = { $regex: description, $options: "i" };
    }

    if (relatedTags) {
      const tagsArray = relatedTags.split(",").map((tag) => tag.trim()); // Split the string by commas and trim whitespace
      searchQuery.related_tags = { $all: tagsArray }; // Match documents where tags contain all of the specified tags
    }
    if (color) {
      searchQuery.color = { $regex: color, $options: "i" };
    }

    if (icon) {
      searchQuery.icon = { $regex: icon, $options: "i" };
    }
    // Fetch quotes with pagination and search
    const tags = await Tag.find(searchQuery)
      .skip((page - 1) * limit) // Skip items for the current page
      .limit(limit); // Limit the number of items per page

    // Get the total number of quotes matching the search query to calculate total pages
    const totalTags = await Tag.countDocuments(searchQuery);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalTags / limit);

    // Send response with pagination details
    res.json({
      tags,
      pagination: {
        totalTags,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

exports.createTag = async (req, res) => {
  const { name, description, relatedTags, color, icon } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const tag = await Tag.findOne({ name });
    if (tag) {
      return res.status(400).json({
        error: "Tag name already exists",
      });
    }
    // This thing only works if you signed up, cause it need ObjectID from createdBy and updatedBy.
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    let tagobjectIDs;
    if (relatedTags && typeof relatedTags == "string") {
      const relatedTagsArray = relatedTags.split(",").map((tag) => tag.trim());
      tagobjectIDs = await Tag.find({ name: { $in: relatedTagsArray } });
    }
    // Create a new quote
    const newTag = new Tag({
      name,
      description,
      related_tags: tagobjectIDs,
      color,
      icon,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    // Save the new quote to the database
    await newTag.save();

    // Respond with the created quote
    res.status(201).json(newTag);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating tag" });
  }
};
exports.updateTag = async (req, res) => {
  const { _id, name, description, relatedTags, color, icon } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "_id is required" });
  }

  try {
    const tag = await Tag.findOne({ _id });
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    if (name !== undefined) {
      const similarTag = await Tag.findOne({ name, _id: { $ne: _id } });
      if (similarTag) {
        return res.status(400).json({
          error: "Tag name already exists",
        });
      }
      tag.name = name;
    }
    if (description !== undefined) {
      tag.description = description;
    }
    if (relatedTags) {
      const relatedTagsArray = relatedTags.split(",").map((tag) => tag.trim());
      tagobjectIDs = await Tag.find({ name: { $in: relatedTagsArray } });
      tag.related_tags = tagobjectIDs;
    }
    if (color !== undefined) {
      tag.color = color;
    }
    if (icon !== undefined) {
      tag.icon = icon;
    }
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    tag.updatedAt = Date.now(); // Update dateModified to current date
    tag.updatedBy = req.user._id;

    // Save the updated tag to the database
    await tag.save();

    res.status(200).json(tag);
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ error: "Error updating tag" });
  }
};
exports.deleteTag = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Missing tag _id" });
  }

  try {
    // Find and delete the quote by quoteNumberId
    const result = await Tag.deleteOne({ _id });

    // Check if the quote was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ error: "Error deleting Tag" });
  }
};
