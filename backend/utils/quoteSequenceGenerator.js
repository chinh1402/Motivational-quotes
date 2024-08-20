// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to generate a shuffled sequence from a given array
function generateShuffledSequence(quotesArray) {
  try {
    const shuffledSequence = shuffleArray([...quotesArray]); // Clone the array before shuffling
    return shuffledSequence;
  } catch (error) {
    console.error('Error generating shuffled sequence:', error.name, error.message);
  }
}
module.exports = generateShuffledSequence;
