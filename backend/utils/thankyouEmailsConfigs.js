const fs = require("fs").promises;
const path = require("path");
require("dotenv").config({ path: "../.env" });

async function generateThankyouEmailContent() {
  try {
    // Load the HTML template using fs.promises
    const templatePath = path.join(
      __dirname,
      "../emailTemplates/daily/thankyou.html"
    );
    let template = await fs.readFile(templatePath, "utf-8");
    template = template.replace(
      "pathtoMotivationalQuotes",
      process.env.WEBPATH
    );

    template = template.replace(
      "http://boilerplatecode.expectedtobereplaced",
      process.env.WEBPATH
    )
    return template;
  } catch (error) {
    console.error("Error generating daily email:", error);
    throw error;
  }
}

module.exports = generateThankyouEmailContent;
