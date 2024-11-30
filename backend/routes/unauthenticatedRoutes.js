const express = require('express');
const router = express.Router();
const unauthenticated = require('../controllers/unregisteredController');

// /api

router.post('/signup', unauthenticated.signup);
router.post('/login', unauthenticated.login);
router.post('/signupConfirmed', unauthenticated.signupConfirmed);
// Post cause stated in docs: preferred delete / post
router.post('/logout', unauthenticated.logout);

// Google authentication routes
router.get('/google', unauthenticated.googleAuth);
router.get('/google/callback', unauthenticated.googleAuthCallback);

router.get('/getQuoteList', unauthenticated.getQuoteList);

router.post('/unsubscribeFromEmail', unauthenticated.unsubscribeFromEmailOneClick);

module.exports = router;
