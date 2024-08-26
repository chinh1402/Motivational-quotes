const path = require("path");
const fs = require("fs").promises;
const sendEmail = require("../services/emailService");
const emailTemplates = require("../emailTemplates/emailTemplateMaps"); // Adjust the path accordingly
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

async function configuratingEmails(templateKey, queryParams = {}) {
  try {
    const templateConfig = emailTemplates[templateKey];

    if (!templateConfig) {
      throw new Error(`Template with key "${templateKey}" not found.`);
    }

    const templatePath = path.join(
      __dirname,
      templateConfig.templateRelativePath
    );
    const templateContent = await fs.readFile(templatePath, "utf8");

    const isProduction = process.env.IS_PRODUCTION;
    let newUrl = isProduction === "true" ? templateConfig.templateWebpathProduction : templateConfig.templateWebpathDev;

    const subject = templateConfig.mailSubject;

    const queryString = new URLSearchParams({ ...queryParams }).toString();
    newUrl += `?${queryString}`;

    const updatedContent = templateContent.replace(
      "http://boilerplatecode.expectedtobereplaced",
      newUrl
    );

    // Send the email with the updated template content
    await sendEmail(queryParams.email, subject, updatedContent);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to handle it where the function is used
  }
}

module.exports = configuratingEmails;
