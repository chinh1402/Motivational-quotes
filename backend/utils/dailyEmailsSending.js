const db = require("../db/db");
const Quote = require("../models/quote");
const QuoteSequence = require("../models/quoteSequence");
const User = require("../models/user");
const generateDailyEmailTemplate = require("./dailyEmailsConfigs");
const sendEmailBulk = require("../services/emailServiceSendBulk");
const generateThankyouEmailContent = require("./thankyouEmailsConfigs");

require("dotenv").config({ path: "../../.env" });

async function dailyEmailSending() {
  try {
    const quoteSequences = await QuoteSequence.find();
    const dailyEmailTemplate = await generateDailyEmailTemplate();
    const thankyouEmailContent = await generateThankyouEmailContent();
    for (const quoteSequenceItem of quoteSequences) {
      try {
        if (
          quoteSequenceItem.userConsent === true &&
          quoteSequenceItem.mailServiceRunning === true
        ) {
          const currentDay = quoteSequenceItem.currentDay;
          const quoteSequenceArray = quoteSequenceItem.quoteSequence;
          const quoteNumberId = quoteSequenceArray[currentDay - 1];
          const email = quoteSequenceItem.email;

          const quote = await Quote.findOne({ quoteNumberId });

          let emailContent = dailyEmailTemplate
            .replace("{day}", currentDay)
            .replace("{content}", quote.content)
            .replace("{author}", quote.author)
            .replace("pathtoMotivationalQuotes", process.env.WEBPATH);

          await sendEmailBulk(
            email,
            `Day ${currentDay} Quote From Quote of the Day`,
            emailContent
          );

          quoteSequenceItem.currentDay += 1;
          await quoteSequenceItem.save();
        } else if (quoteSequenceItem.email === process.env.ADMIN_EMAIL_BULK_SENDING) {
          quoteSequenceItem.currentDay += 1;
          await quoteSequenceItem.save();
        }

        // Handle thank-you email and quote sequence deletion
        const lastSendingDayFormatted = new Date(
          quoteSequenceItem.lastSendingDay
        )
          .toISOString()
          .split("T")[0];

        if (
          quoteSequenceItem.mailServiceRunning === true &&
          quoteSequenceItem.email !== process.env.ADMIN_EMAIL_BULK_SENDING &&
          (quoteSequenceItem.currentDay >
            quoteSequenceItem.quoteSequence.length ||
            new Date().toISOString().split("T")[0] >= lastSendingDayFormatted)
        ) {
          const emailContent = thankyouEmailContent;

          await sendEmailBulk(
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
        } else if (
          quoteSequenceItem.email === process.env.ADMIN_EMAIL_BULK_SENDING &&
          (quoteSequenceItem.currentDay >
            quoteSequenceItem.quoteSequence.length ||
            new Date().toISOString().split("T")[0] >= lastSendingDayFormatted)
        ) {
          quoteSequenceItem.currentDay = 1;
          await quoteSequenceItem.save();
        }
      } catch (error) {
        console.error(
          `Error processing quoteSequenceItem ${quoteSequenceItem._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// dailyEmailSending();

module.exports = dailyEmailSending;
