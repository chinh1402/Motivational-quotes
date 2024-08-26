const axios = require("axios");
const mongoose = require("mongoose");
require("../../db/db");

const Quote = require("../../models/quote");
const Tag = require("../../models/tag");

require("dotenv").config({ path: "../../.env" });

// adding toolongforwebUI property to quotes. If quote.length > 150, true. else false

async function addingtoolongforwebUIprop() {
    try {
        const quotes = await Quote.find();
        quotes.forEach(async (quote) => {
            quote.toolongforwebUI = quote.length > 150 ? true : false;
            await quote.save();
        })
    } catch (error) {
        console.log(error)
    }
}

addingtoolongforwebUIprop()