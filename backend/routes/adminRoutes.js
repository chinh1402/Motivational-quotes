const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Example protected route
router.get("/quotes", adminController.getQuotes);
router.post("/addQuote", adminController.createQuote);
router.put("/updateQuote", adminController.updateQuote);
router.delete("/deleteQuote", adminController.deleteQuote);

router.get("/quoteSequences", adminController.getQuoteSequences);
router.post("/createQuoteSequence", adminController.createQuoteSequence);
router.put("/updateQuoteSequence", adminController.updateQuoteSequence);
router.delete("/deleteQuoteSequence", adminController.deleteQuoteSequence);

router.get("/users", adminController.getUsers);
router.post("/addUser", adminController.createUser);
router.put("/updateUser", adminController.updateUsers);
router.delete("/deleteUser", adminController.deleteUser);

router.get("/tags", adminController.getTags); 
router.post("/addTag", adminController.createTag); 
router.put("/updateTag", adminController.updateTag); 
router.delete("/deleteTag", adminController.deleteTag); 

module.exports = router;
