const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");
require('dotenv').config();

// Local Strategy
passport.use(new LocalStrategy(
    {
      // using these fields for logging in 
      usernameField: 'loginUsernameOrEmail', 
      passwordField: 'password'
    },
    async (loginUsernameOrEmail, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ email: loginUsernameOrEmail }, { username: loginUsernameOrEmail }]
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email/username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      // If no user found, create a new one
      const newUser = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,  // The first email in the list
        password: process.env.PASSWORD_FOR_GOOGLE_AUTH
      });

      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

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
