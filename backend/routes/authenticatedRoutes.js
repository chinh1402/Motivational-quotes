const express = require('express');
const router = express.Router();
const authenticated = require('../controllers/authenticatedController');

// /api/authenticated

router.post('/emailSubscribedRandom', authenticated.emailSubscribedRandom);
router.post('/emailSubscribedDaily', authenticated.emailSubscribedDaily);
router.delete('/emailUnsubscribe', authenticated.emailUnsubscribe);

router.post('/emailServiceSignup', authenticated.emailServiceSignup);
router.post('/emailServiceSignupConfirmed', authenticated.emailServiceSignupConfirmed);

router.post('/handleQuoteFavorite', authenticated.handleQuoteFavorite);
router.get('/getAccountDetails', authenticated.getAccountDetails);
router.post('/updateAccountRequest', authenticated.updateAccountRequest);
router.post('/updateAccountRequestConfirmed', authenticated.updateAccountRequestConfirmed);
router.get('/getFavoriteQuotes', authenticated.getFavoriteQuotes)
router.post('/changePasswordRequest', authenticated.changePasswordRequest);
router.post('/changePasswordConfirmed', authenticated.changePasswordConfirmed)
router.delete('/deleteSelfFromUser', authenticated.deleteSelfFromUser)
router.post('/toggleEmailService', authenticated.toggleEmailService);



module.exports = router;
