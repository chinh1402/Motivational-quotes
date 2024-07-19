const express = require('express');
const session = require('express-session');
const passport = require('passport');

// .env
require('dotenv').config();

// passport for handling authentication
require('./config/passportConfig');

// Db innit
require('./db/db');

const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { ensureAuthenticated, ensureAdmin } = require('./middlewares/authMiddleware');

require('./utils/cronJob');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', ensureAuthenticated, authRoutes);
app.use('/api/quotes', ensureAuthenticated, quoteRoutes);
app.use('/api/admin', ensureAuthenticated, ensureAdmin, adminRoutes);

module.exports = app;
