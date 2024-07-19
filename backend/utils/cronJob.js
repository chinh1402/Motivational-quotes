const cron = require("node-cron");
const Quote = require("../models/quote");
const quoteSequence = require("../models/quoteSequence");
const sendEmail = require("../services/emailService");
const database = require("../db/db");
require("dotenv").config();

// By default, 5AM GMT+7, server will send email to everyone who signed up
cron.schedule('0 5 * * *', async () => {
  console.log("This cron run at 10:45AM GMT+7");
  const quoteSequencesList = await quoteSequence.find();
  quoteSequencesList.forEach(async (quoteSequencesitem) => {
    let userEmail = quoteSequencesitem.userEmail;
    let quoteDay = quoteSequencesitem.currentDay;
    let quoteIndex = quoteSequencesitem.currentIndex;
    let quoteSequenceArr = quoteSequencesitem.quoteSequence;

    let quoteNumberId = quoteSequenceArr[quoteIndex];
    let quote = await Quote.find({ quoteNumberId: quoteNumberId });

    sendEmail(
      userEmail,
      `Day ${quoteDay} Quote From Quote of the Day`,
      `${quote[0].content} - ${quote[0].author}`
    );

    const totalQuotes = await Quote.countDocuments();

    // End of sequence array
    if (quoteIndex === totalQuotes - 1) {
      // Admin can't be delete
      if (userEmail == process.env.ADMIN_EMAIL) {
        // reset to 0
        console.log("admin get resetted to 0");
        await quoteSequence.findOneAndUpdate(
          { userEmail },
          {
            $set: {
              currentIndex: 0,
              currentDay: 1,
              updatedAt: formatDateToEnUS(new Date()),
            },
          },
          { new: true } // Return the updated document
        );

        return;
      }
      // When out of quotes, delete the subscription
      console.log("deleting subscription...");
      sendEmail(
        userEmail,
        `Thank you for using Quote of the Day`,
        `we're appreciate what you're doing, now we delete`
      );
      await quoteSequence.findOneAndDelete({ userEmail: userEmail });
      return;
    }
    // Update after sending email
    await quoteSequence.findOneAndUpdate(
      { userEmail },
      {
        $set: {
          currentIndex: quoteIndex + 1,
          currentDay: quoteDay + 1,
          updatedAt: formatDateToEnUS(new Date()),
        },
      },
      { new: true } // Return the updated document
    );
    console.log("Updated datas in mongo");
  });
}, {
  timezone: 'Asia/Ho_Chi_Minh'  
});

function formatDateToEnUS(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}