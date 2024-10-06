export default (time) => {
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);

  let period = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  return `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
};
