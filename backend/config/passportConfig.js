const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");
require("dotenv").config();

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      // using these fields for logging in
      usernameField: "loginusernameoremail",
      passwordField: "password",
    },
    async (loginUsernameOrEmail, password, done) => {
      try {
        const user = await User.findOne({
          $or: [
            { email: loginUsernameOrEmail },
            { username: loginUsernameOrEmail },
          ],
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email/username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        const isTooShort = password.length < 5;
        if (!isMatch || isTooShort) {
          return done(null, false, { message: "Incorrect password, or password is too short" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Step 1: Check if there's an existing user with the Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Step 2: If no Google account is found, check if there's an existing user with the same email
        existingUser = await User.findOne({
          emailSignin: profile.emails[0].value,
        });

        if (existingUser) {
          // Step 3: If a user exists with the same email but not with Google, link the Google ID
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // If duplicated username, generate a new username.
        existingUser = await User.findOne({ username: profile.displayName });

        if (existingUser) {
          // Generate a unique username
          const baseUsername = profile.displayName;
          let newUsername = baseUsername;
          let count = 1;

          // Loop to find a unique username
          while (await User.findOne({ username: newUsername })) {
            newUsername = `${baseUsername}${count}`;
            count++;
          }

          profile.displayName = newUsername; // Update profile displayName with the unique username
        }

        // If no user found, create a new one
        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          emailSignin: profile.emails[0].value, 
          password: process.env.PASSWORD_FOR_GOOGLE_AUTH, 
          avatarURL: profile.photos[0].value,
          timezone: "UTC", // Default timezone
          role: 0, // New users are authenticated users
          agreedtoTOSandPrivacyPolicy: false,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialization and Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
