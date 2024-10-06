const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    return "No date found";
  }
};
export default formatDate