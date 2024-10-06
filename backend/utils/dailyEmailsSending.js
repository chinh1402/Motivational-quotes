const db = require("../db/db");
const Quote = require("../models/quote");
const QuoteSequence = require("../models/quoteSequence");
const User = require("../models/user");
const generateDailyEmailContent = require("./dailyEmailsConfigs");
const sendEmail = require("../services/emailService");
const generateThankyouEmailContent = require("./thankyouEmailsConfigs");

require("dotenv").config({ path: "../../.env" });

async function dailyEmailSending() {
  try {
    const quoteSequences = await QuoteSequence.find();

    quoteSequences.forEach(async (quoteSequenceItem) => {
      if (
        quoteSequenceItem.userConsent === true &&
        quoteSequenceItem.mailServiceRunning === true
      ) {
        const currentDay = quoteSequenceItem.currentDay;
        const quoteSequenceArray = quoteSequenceItem.quoteSequence;
        const quoteNumberId = quoteSequenceArray[currentDay - 1];
        const quote = await Quote.findOne({ quoteNumberId });
        const emailContent = await generateDailyEmailContent({
          day: currentDay,
          content: quote.content,
          author: quote.author,
        });
        sendEmail(
          quoteSequenceItem.email,
          `Day ${currentDay} Quote From Quote of the Day`,
          emailContent
        );

        quoteSequenceItem.currentDay += 1;

        await quoteSequenceItem.save();
      } else if (quoteSequenceItem.email === process.env.ADMIN_EMAIL) {
        quoteSequenceItem.currentDay += 1;
        await quoteSequenceItem.save();
      }

      const lastSendingDayFormatted = new Date(
        quoteSequenceItem.lastSendingDay
      )
        .toISOString()
        .split("T")[0];

      if (
        quoteSequenceItem.currentDay >
          quoteSequenceItem.quoteSequence.length ||
        new Date().toISOString().split("T")[0] >= lastSendingDayFormatted
      ) {
        const emailContent = await generateThankyouEmailContent();

        sendEmail(
          quoteSequenceItem.email,
          "Thank You for Being a Part of Quote of the Day!",
          emailContent
        );

        const user = await User.findOne({ email: quoteSequenceItem.email });

        if (user) {
          user.isSignedupForEmail = false;
          await user.save();
        }

        await QuoteSequence.deleteOne({ _id: quoteSequenceItem._id });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = dailyEmailSending;
