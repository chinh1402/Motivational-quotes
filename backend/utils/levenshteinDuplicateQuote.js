const levenshtein = require("fast-levenshtein");

const dupicatorCheck = (currentContent, quoteFromDB) => {
    const similarityThreshold = 0.6; // Adjust this threshold as needed (1 = identical, 0 = completely different)

    const similarity = levenshtein.get(currentContent, quoteFromDB.content);
    const maxLength = Math.max(currentContent.length, quoteFromDB.content.length);
    const similarityRatio = 1 - similarity / maxLength;

    if (similarityRatio > similarityThreshold) {
        return true;
    }
}

module.exports = dupicatorCheck 