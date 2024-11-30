const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');

// .env
require('dotenv').config();

// passport for handling authentication
require('./config/passportConfig');

// Db innit
require('./db/db');

const unregisteredRoutes = require('./routes/unauthenticatedRoutes');
const authenticatedRoutes = require('./routes/authenticatedRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { ensureAuthenticated, ensureAdmin } = require('./middlewares/authMiddleware');

const app = express();

require('./utils/cronJob');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  }));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', unregisteredRoutes);
app.use('/api/authenticated', ensureAuthenticated, authenticatedRoutes);
// app.use('/api/admin', ensureAuthenticated, ensureAdmin, adminRoutes);
app.use('/api/admin', adminRoutes);



module.exports = app;
