const mongoose = require("mongoose");
const quoteSequenceGenerator = require("../utils/quoteSequenceGenerator");
const User = require("../models/user");
const QuoteSequence = require("../models/quoteSequence");
const Quote = require("../models/quote");
const Tag = require("../models/tag");
const passwordValidator = require("../utils/passwordValidator");
const bcrypt = require("bcryptjs");
const configuratingEmails = require("../utils/configuratingEmails");
const jwt = require("jsonwebtoken");
require("dotenv").config("../.env");

exports.emailUnsubscribe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    // Check if quote sequence exists
    const existingSequence = await QuoteSequence.findOne({
      email: req.user.email,
    });
    if (!existingSequence) {
      return res.status(404).send({ error: "Quote sequence not found" });
    }

    if (existingSequence.tags.length > 0) {
      const tagObjects = await Tag.find({
        _id: { $in: existingSequence.tags },
      });
      // Update the tags
      for (const tagObject of tagObjects) {
        tagObject.quoteSequenceCount -= 1;
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
    await QuoteSequence.deleteOne({ email: req.user.email });
    // Send confirmation response
    console.log("Deleted quote sequence for", user.email);
    res.status(200).send({ message: "Quote sequence deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote sequence:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.emailServiceSignupConfirmed = async (req, res) => {
  // Update userConsent in quote sequence to true, also mailServiceRunning to true
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    const user = await User.findOne({ _id: req.user._id });

    const quoteSequence = await QuoteSequence.findOne({
      email: req.user.email,
    });
    if (!quoteSequence) {
      return res.status(404).json({ error: "Quote sequence not found" });
    }

    quoteSequence.userConsent = true;
    quoteSequence.mailServiceRunning = true;
    await quoteSequence.save();

    user.isSignedupForEmail = true;
    await user.save();
    res
      .status(200)
      .json({ message: "User consent confirmed, Email service activated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Same thing as admin createQuoteSequence apis
exports.emailServiceSignup = async (req, res) => {
  const {
    email,
    sequenceType,
    tags,
    tagQueryType,
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
    // Check if user exists
    const user = await User.findOne({ _id: req.user._id });
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
        email: process.env.ADMIN_EMAIL_BULK_SENDING,
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
        sequenceType,
        tags: dailySequence.tags,
        tagNames: dailySequence.tagNames,
        tagQueryType: dailySequence.tagQueryType,
        currentDay: dailySequence.currentDay,
        startSendingDay: new Date(startSendingDay),
        lastSendingDay: new Date(lastSendingDay),
        timezone,
        sendAt,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });
      await quoteSequence.save();

      // Increment the quoteSequenceCount for the associated tags
      const tagObjects = await Tag.find({ _id: { $in: dailySequence.tags } });
      for (const tag of tagObjects) {
        tag.quoteSequenceCount += 1;
        await tag.save();
      }
    } else if (sequenceType === "random") {
      // Handle tags if provided
      let tagIds = [];
      if (tags) {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        const tagObjects = await Tag.find({ name: { $in: tagArray } });
        tagIds = tagObjects.map((tag) => tag._id);

        // Increment the quoteSequenceCount for the associated tags
        for (const tag of tagObjects) {
          tag.quoteSequenceCount += 1;
          await tag.save();
        }
      }

      // Fetch possible quote IDs based on tags
      let possibleQuotesNumberId = await Quote.distinct("quoteNumberId", {
        tags: tagQueryType === "matchAny" ? { $in: tagIds } : { $all: tagIds },
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
        sequenceType,
        tags: tagIds,
        tagNames: tags,
        tagQueryType,
        timezone,
        startSendingDay: new Date(startSendingDay),
        lastSendingDay: new Date(lastSendingDay),
        sendAt,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });
      await quoteSequence.save();
    }

    configuratingEmails("confirmSignupEmailservice", { email: user.email });
    res.status(200).send({
      message: "Success! Await for email confirmation",
      quoteSequence,
    });
  } catch (error) {
    console.error("Error creating quote sequence:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAccountDetails = async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Unauthenticated" });
  }
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  return res.status(200).send({ user });
};

// Same thing as update user, except that it's using req.user._id!
exports.updateAccountRequest = async (req, res) => {
  const {
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

  try {
    // Construct the update query
    let updateFields = {};

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    } else {
      updateFields._id = req.user._id;
    }

    if (email) {
      // Check if email is already used by another user
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      updateFields.email = email;
    }
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
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

    const userWithUpdateRequest = await User.findOne({ _id: req.user._id });

    if (!userWithUpdateRequest) {
      return res.status(404).json({ error: "User not found" });
    }

    // Clean the current tempUpdateStorage first
    userWithUpdateRequest.tempUpdateStorage = {};

    // Then assign new one
    userWithUpdateRequest.tempUpdateStorage = updateFields;
    await userWithUpdateRequest.save();

    // Send response with the updated user details
    configuratingEmails("userDataUpdate", { email: req.user.email });
    res.json({
      message: "Request is sent successfully, await for email confirmation",
      user: userWithUpdateRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.updateAccountRequestConfirmed = async (req, res) => {
  try {
    // Construct the update query
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    const userWithUpdateRequest = await User.findOne({ _id: req.user._id });

    if (!userWithUpdateRequest) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = userWithUpdateRequest.tempUpdateStorage;

    if (updateData.email) {
      // Check if email is already used by another user
      const email = updateData.email;
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      userWithUpdateRequest.email = updateData.email;
    }
    if (updateData.username) {
      const username = updateData.username;
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({ error: "username is already in use" });
      }
      userWithUpdateRequest.username = updateData.username;
    }
    if (updateData.phone) {
      userWithUpdateRequest.phone = updateData.phone;
    }
    if (updateData.country) {
      userWithUpdateRequest.country = updateData.country;
    }
    if (updateData.timezone) {
      userWithUpdateRequest.timezone = updateData.timezone;
    }
    if (updateData.firstName) {
      userWithUpdateRequest.firstName = updateData.firstName;
    }
    if (updateData.lastName) {
      userWithUpdateRequest.lastName = updateData.lastName;
    }
    if (updateData.gender) {
      userWithUpdateRequest.gender = updateData.gender;
    }
    if (updateData.avatarURL) {
      userWithUpdateRequest.avatarURL = updateData.avatarURL;
    }
    if (updateData.birthDate) {
      userWithUpdateRequest.birthDate = new Date(updateData.birthDate);
    }

    // Clear the tempUpdateStorage
    userWithUpdateRequest.tempUpdateStorage = {};

    await userWithUpdateRequest.save();

    // Send response with the updated user details
    res.json({
      message: "Save data successfully",
      user: userWithUpdateRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.handleQuoteFavorite = async (req, res) => {
  const { quoteNumberId, favorite } = req.body; // 'favorite' is a boolean

  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }

    const userWithUpdateRequest = await User.findOne({ _id: req.user._id });
    if (!userWithUpdateRequest) {
      return res.status(404).json({ error: "User not found" });
    }

    const quote = await Quote.findOne({ quoteNumberId });
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }

    if (favorite) {
      // Add the quote to the user's favorites
      if (userWithUpdateRequest.favoriteQuotes.includes(quoteNumberId)) {
        return res.status(400).json({ error: "Quote already favorited" });
      }

      userWithUpdateRequest.favoriteQuotes.push(quoteNumberId);
      quote.favorites += 1;
      await userWithUpdateRequest.save();
      await quote.save();

      res.status(200).json({ message: "Quote favorited" });
    } else {
      // Remove the quote from the user's favorites
      if (!userWithUpdateRequest.favoriteQuotes.includes(quoteNumberId)) {
        return res.status(400).json({ error: "Quote not in favorites" });
      }
      const parsedQuoteNumberId = Number(quoteNumberId);
      userWithUpdateRequest.favoriteQuotes =
        userWithUpdateRequest.favoriteQuotes.filter(
          (quoteId) => quoteId !== parsedQuoteNumberId
        );
      quote.favorites -= 1;
      await userWithUpdateRequest.save();
      await quote.save();

      res.status(200).json({ message: "Quote unfavorited" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating user and quote" });
  }
};

exports.getFavoriteQuotes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }

    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const quotes = await Quote.find({
      quoteNumberId: { $in: user.favoriteQuotes },
    });
    res.status(200).json({ quotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting favorite quotes" });
  }
};

exports.changePasswordRequest = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }

    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { oldPassword } = req.body;

    if (!oldPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Then we send verification email to save
    configuratingEmails("passwordUpdate", { email: user.email, token });

    res.status(200).json({ message: "Success. Email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error changing password" });
  }
};

// This whole thing is written so that It will redirect user from UI if no permission
exports.changePasswordVerifyToken = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ error: "Invalid token" });
    }

    res
      .status(200)
      .json({ message: "Token verified, user proceed to the page" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal server errors" });
  }
};

exports.changePasswordConfirmed = async (req, res) => {
  const { newPassword } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Invalid
    if (passwordValidator(newPassword) !== null) {
      return res.status(400).json({ error: passwordValidator(newPassword) });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password successfully changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error changing password" });
  }
};

exports.deleteSelfFromUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }
    const user = await User.findOne({ _id: req.user._id });
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

    const result = await User.deleteOne({ _id: req.user._id });

    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

exports.toggleEmailService = async (req, res) => {
  // toggle mailServiceRunning in quoteSequence

  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized. If you read this, you're probably using Postman. Ask the administrator for an account.",
      });
    }
    const quoteSequence = await QuoteSequence.findOne({
      email: req.user.email,
    });
    if (!quoteSequence) {
      return res.status(404).json({ error: "Quote Sequence not found" });
    }

    // only when turning mail service on, change the date

    if (!quoteSequence.mailServiceRunning) {
      const remainingDays = quoteSequence.quoteSequence.length - quoteSequence.currentDay;
      const lastSendingDay = new Date();
      lastSendingDay.setDate(lastSendingDay.getDate() + remainingDays);

      quoteSequence.lastSendingDay = lastSendingDay
    }

    quoteSequence.mailServiceRunning = !quoteSequence.mailServiceRunning;
    await quoteSequence.save();
    res.status(200).json({
      message: `Email service ${
        quoteSequence.mailServiceRunning ? "on" : "off"
      }`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error changing email service" });
  }
};

exports.getAllTagNames = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error:
          "Unauthorized, If you read this, you're probably using postman. Ask administrator for an account",
      });
    }

    const tagNames = await Tag.distinct("name");
    res.status(200).json(tagNames);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllQuotes = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    content,
    author,
    quoteNumberId,
    tags,
    tagQueryType,
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
      searchQuery.quoteNumberId = { $regex: quoteNumberId, $options: "i" }; // Exact match for quoteNumberId
    }
    // tags is string
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Split the string by commas and trim whitespace
      const tagObjects = await Tag.find({ name: { $in: tagsArray } });
      const tagIds = tagObjects.map((tag) => tag._id);
      searchQuery.tags =
        tagQueryType === "matchAny" ? { $in: tagIds } : { $all: tagIds };
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
