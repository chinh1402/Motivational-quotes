// Generating a shuffled sequence array based on a given count

function createSequenceArray(count) {
  return Array.from({ length: count }, (_, i) => i + 1);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateShuffledSequence(quoteslength) {
  try {
    const sequenceArray = createSequenceArray(quoteslength);
    const shuffledSequence = shuffleArray(sequenceArray);
    return shuffledSequence;
  } catch (error) {
    console.error('Error generating shuffled sequence:', error.name, error.message);
  }
}

module.exports = generateShuffledSequence;
