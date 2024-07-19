const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Example protected route
router.get("/quotes", adminController.getQuotes);
router.post("/addQuote", adminController.createQuote);
router.put("/updateQuote", adminController.updateQuote);
router.delete("/deleteQuote", adminController.deleteQuote);

router.get("/quoteSequences", adminController.getQuoteSequences);
router.post("/addQuoteSequence", adminController.createQuoteSequence);
router.delete("/deleteQuoteSequence", adminController.deleteQuoteSequence);

// No need to update quote Sequences because it is not necessary. There's no info to change except for userEmail.. 
// But you can just delete the sequence anyway, since it doesn't really matter. 
// If random then there's no point. If daily then there's fixed value anyway

router.get("/users", adminController.getUsers);
router.delete("/deleteuser", adminController.deleteQuoteSequence);

// no need to add, update user data
module.exports = router;
