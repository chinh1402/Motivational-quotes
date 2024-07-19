const mongoose = require("mongoose");
const quoteSequenceGenerator = require("../utils/quoteSequenceGenerator");
const User = require("../models/user");
const QuoteSequence = require("../models/quoteSequence");
const Quote = require("../models/quote");



// exports.addQuote = async (req, res) => {
//   const { text, author } = req.body;
//   const newQuote = new Quote({ text, author });
//   await newQuote.save();
//   res.send('Quote added');
// };

// code flow:
// 1. get the last used quote id. If it is null => Assign first value can be found from Quote to it.
// 2. If the last used quote id is the same as the total number of quotes => Assign first value can be found from Quote to it.
// 3. If the last used quote id is not the same as the total number of quotes => Find the next unused quote by its ID.

// the id fields are: _id
exports.emailSubscribedRandom = async (req, res) => {
  const { userEmail, options } = req.body;

  // Validate input
  if (!userEmail || !options) {
    return res
      .status(400)
      .send({ error: "userEmail and options are required" });
  }

  try {
    // Check if user exists

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const existingSequence = await QuoteSequence.findOne({ userEmail: user.email });
    if (existingSequence) {
      return res
        .status(400)
        .send({ error: "User already signed up for daily emails" });
    }

    // Get the total number of quotes
    const totalQuotes = await Quote.countDocuments();

    // Generate shuffled quote sequence
    const shuffledSequence = await quoteSequenceGenerator(totalQuotes);

    // Save subscription details
    const quoteSequence = new QuoteSequence({
      userEmail: user.email,
      quoteSequence: shuffledSequence,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await quoteSequence.save();

    // Send confirmation response
    console.log("There's a subscription from ", user.email);
    res.status(200).send({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error subscribing to daily emails:", error);

    res.status(500).send({ error: "Internal server error" });
  }
};

exports.emailSubscribedDaily = async (req, res) => {
  const { userEmail, options } = req.body;
  const fixedEmail = process.env.ADMIN_EMAIL;

  // Validate input
  if (!userEmail || !options) {
    return res.status(400).send({ error: "userEmail and options are required" });
  }

  try {
    // Check if admin exists
    const admin = await User.findOne({ email: fixedEmail });
    if (!admin) {
      return res.status(404).send({ admin: "Admin not found" });
    }

    const dailyQuoteInstance = await QuoteSequence.findOne({ userEmail: admin.email });
    if (dailyQuoteInstance.length === 0) {
      return res
        .status(404)
        .send({ error: "No quote sequences found for the admin" });
    }

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const existingSequence = await QuoteSequence.findOne({ userEmail: user.email });
    if (existingSequence) {
      return res
        .status(400)
        .send({ error: "User already signed up for daily emails" });
    }

    const quoteSequence = new QuoteSequence({
        userEmail: user.email,
        quoteSequence: dailyQuoteInstance.quoteSequence,
        currentIndex: dailyQuoteInstance.currentIndex,
        currentDay: dailyQuoteInstance.currentDay,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await quoteSequence.save();

    // Send confirmation response
    res.status(200).send({ message: "Signed up for daily quote same as on the web sucessfully" });
  } catch (error) {
    console.error("Error copying quote sequences:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.emailUnsubscribe = async (req, res) => {
  const { userEmail } = req.body;
  if (!userEmail) {
    return res.status(400).send({ error: "userEmail is required" });
  }
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const existingSequence = await QuoteSequence.findOne({ userEmail: user.email });
    if (!existingSequence) {
      return res
        .status(400)
        .send({ error: "User has not signed up for daily emails" });
    }
    await QuoteSequence.deleteOne({ userEmail: user.email });
    res.status(200).send({ message: "Unsubscription successful" });
  } catch (error) {
    console.error("Error unsubscribing from daily emails:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getRandomQuote = async (req,res) => {
  const batchCount = parseInt(req.query.count) || 100;
  try {
    
    const totalQuotes = await Quote.countDocuments();
    if (totalQuotes === 0) {
      return res.status(404).send({ error: "No quotes found" });
    }

    const sequenceArr = quoteSequenceGenerator(totalQuotes);
    
    const randomQuotes = await Quote.find({
      quoteNumberId: { $in: sequenceArr.slice(0, batchCount) }
    });

    res.status(200).send(randomQuotes);
  } catch (error) {
    console.error("Error fetching random quotes:", error);
    res.status(500).send({ error: "Internal server error" });
  }
}