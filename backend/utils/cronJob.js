const cron = require("node-cron");
const dailyEmailSending = require("./dailyEmailsSending");
require("dotenv").config();

// Define the time for the cron job
const minute = "0"; // 0th minute of the hour
const hour = "5"; // 5 AM
const dayOfMonth = "*"; // Every day of the month
const month = "*"; // Every month
const dayOfWeek = "*"; // Every day of the week

// Define the timezone
const timezone = "Asia/Ho_Chi_Minh"; // GMT+7 (Ho Chi Minh City, Vietnam)

// Set the cron job to run at 5 AM GMT+7 every day
cron.schedule(
  `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, // Cron expression
  async () => {
    console.log("This cron runs at 5 AM GMT+7");
    await dailyEmailSending(); // Ensure async operation is handled properly
  },
  {
    timezone: timezone,
  }
);
