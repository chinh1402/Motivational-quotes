const express = require('express');
const router = express.Router();
const unauthenticated = require('../controllers/unregisteredController');

router.post('/signup', unauthenticated.signup);
router.post('/login', unauthenticated.login);

// Post cause stated in docs: preferred delete / post
router.post('/logout', unauthenticated.logout);

// Google authentication routes
router.get('/google', unauthenticated.googleAuth);
router.get('/google/callback', unauthenticated.googleAuthCallback);

router.get('/getQuoteList', unauthenticated.getQuoteList);


module.exports = router;
