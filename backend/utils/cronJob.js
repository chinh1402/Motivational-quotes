// cronjob.js
const cron = require("node-cron");
const dailyEmailSending = require("./dailyEmailsSending");
require("dotenv").config();

const scheduleDailyEmails = () => {
  // Since sending 500 emails takes 15 mins... This is a shitty kind of hard code but it kind of a workaround
 
  const minute = "45"; // 45th minute of the hour
  const hour = "4"; // 4 AM
  const dayOfMonth = "*"; // Every day of the month
  const month = "*"; // Every month
  const dayOfWeek = "*"; // Every day of the week

  const timezone = "Asia/Ho_Chi_Minh"; // GMT+7 (Ho Chi Minh City, Vietnam)

  cron.schedule(
    `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`,
    async () => {
      console.log("This cron runs at 5 AM GMT+7");
      await dailyEmailSending();
    },
    {
      timezone: timezone,
    }
  );
};

module.exports = scheduleDailyEmails;
