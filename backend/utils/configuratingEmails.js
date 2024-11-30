const path = require("path");
const fs = require("fs").promises;
const sendEmail = require("../services/emailServiceOthers");
const emailTemplates = require("../emailTemplates/emailTemplateMaps"); // Adjust the path accordingly
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

async function configuratingEmails(templateKey, queryParams = {}) {
  try {
    const templateItem = emailTemplates[templateKey];

    if (!templateItem) {
      throw new Error(`Template with key "${templateKey}" not found.`);
    }

    const templatePath = path.join(
      __dirname,
      templateItem.templateRelativePath
    );
    
    let newUrl = process.env.IS_PRODUCTION === "true" ? templateItem.templateWebpathProduction : templateItem.templateWebpathDev;

    const queryString = new URLSearchParams({ ...queryParams }).toString();
    newUrl += `?${queryString}`;

    const templateContent = await fs.readFile(templatePath, "utf8");

    const email = queryParams.email;
    const emailSubject = templateItem.mailSubject;
    const emailContent = templateContent.replace(
      "http://boilerplatecode.expectedtobereplaced",
      newUrl
    );

    // Each email need: destination email, emailSubject (header), emailContent (content)
    await sendEmail(email, emailSubject, emailContent);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to handle it where the function is used
  }
}

module.exports = configuratingEmails;
