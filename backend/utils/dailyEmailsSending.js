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
        quoteSequenceItem.user_consent === true &&
        quoteSequenceItem.on_halt === true
      ) {
        const current_day = quoteSequenceItem.current_day;
        const quoteSequenceArray = quoteSequenceItem.quoteSequence;
        const quoteNumberId = quoteSequenceArray[current_day - 1];
        const quote = await Quote.findOne({ quoteNumberId });
        const emailContent = await generateDailyEmailContent({
          day: current_day,
          content: quote.content,
          author: quote.author,
        });
        sendEmail(
          quoteSequenceItem.email,
          `Day ${current_day} Quote From Quote of the Day`,
          emailContent
        );

        quoteSequenceItem.current_day += 1;

        await quoteSequenceItem.save();
      } else if (quoteSequenceItem.email === process.env.ADMIN_EMAIL) {
        quoteSequenceItem.current_day += 1;
        await quoteSequenceItem.save();
      }

      const lastSendingDayFormatted = new Date(
        quoteSequenceItem.last_sending_day
      )
        .toISOString()
        .split("T")[0];

      if (
        quoteSequenceItem.current_day >
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

dailyEmailSending();

module.exports = dailyEmailSending;
