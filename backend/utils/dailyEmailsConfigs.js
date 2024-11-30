const fs = require('fs').promises;
const path = require('path');
require("dotenv").config({ path: "../.env" });

async function generateDailyEmailTemplate() {
  try {
    // Load the HTML template using fs.promises
    const templatePath = path.join(__dirname, '../emailTemplates/daily/dailyTemplate.html');
    let template = await fs.readFile(templatePath, 'utf-8');

    // // Replace placeholders in the template
    
    // template = template.replace('{day}', quoteSequenceData.day);
    // template = template.replace('{content}', quoteSequenceData.content);
    // template = template.replace('{author}', quoteSequenceData.author);
    // template = template.replace('pathtoMotivationalQuotes', process.env.WEBPATH)

    return template;

  } catch (error) {
    console.error('Error generating daily email:', error);
    throw error;
  }
}

module.exports = generateDailyEmailTemplate