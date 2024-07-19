const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Post cause stated in docs: preferred delete / post
router.post('/logout', authController.logout);

// Google authentication routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

module.exports = router;
