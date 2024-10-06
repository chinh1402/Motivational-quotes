// cronjob.js
const cron = require("node-cron");
const dailyEmailSending = require("./dailyEmailsSending");
require("dotenv").config();

const scheduleDailyEmails = () => {
  const minute = "0"; // 0th minute of the hour
  const hour = "5"; // 5 AM
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
