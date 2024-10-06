export default (isoString) => {
  if (isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Extracts the date part only
  }
  return "";
};

