const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const Quote = require("../models/quote");
const Tag = require("../models/tag");
require("dotenv").config();

exports.signup = [
  // Validation middleware
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  body("email").isEmail().withMessage("Email must be valid"),

  // Signup controller
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, email } = req.body;

      // Check if a user with the same username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Username or email already exists" });
      }

      // Create a new user instance
      const newUser = new User({
        username,
        password,
        email,
        timezone: "UTC", // Default timezone
        role: 0,
        agreedtoTOSandPrivacyPolicy: false,
      });

      // Await for save operation to complete
      await newUser.save();

      // Respond with success message
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  },
];

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: "Username or password is not correct." });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        if (user.emailSignin === process.env.ADMIN_EMAIL) {
          return res.redirect("/admin");
        }
        return res.redirect("/");
      });
    }
  )(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful, redirecting..." });
    res.redirect("/");
  });
};

exports.getQuoteList = async (req, res) => {
  let {
    page = 1,
    limit = 20,
    content,
    author,
    quoteNumberId,
    tags,
    random,
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

    if (random) {
      tags = "Inspirational, Life, Change, Future, Happiness";
    }

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Split the string by commas and trim whitespace
      const tagObjects = await Tag.find({ name: { $in: tagsArray } });
      const tagObjects_ids = tagObjects.map((tag) => tag._id);
    
      searchQuery.tags = random ? { $in: tagObjects_ids } : { $all: tagObjects };
    }

    const quotes = random
      ? await Quote.aggregate([
          { $match: searchQuery },
          { $sample: { size: 100 } },
        ])
      : await Quote.find(searchQuery)
          .skip((page - 1) * limit)
          .limit(limit);

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
