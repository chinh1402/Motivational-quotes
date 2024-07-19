const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

router.post('/email-subscribed-random', quoteController.emailSubscribedRandom);
router.post('/email-subscribed-daily', quoteController.emailSubscribedDaily);
router.post('/email-unsubscribe', quoteController.emailUnsubscribe);
router.post('/get-random-quote', quoteController.getRandomQuote);

module.exports = router;
