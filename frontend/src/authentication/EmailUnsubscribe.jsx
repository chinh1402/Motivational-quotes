import React, { useState } from "react";
import axios from "axios";

const emailUnsubscribe = () => {
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3000/api/authenticated/emailUnsubscribe",
        { withCredentials: true } // Ensure cookies are sent
      );
      setMessage("Unsubscribed successfully"); // Set success message
    } catch (error) {
      setMessage("Error: Unable to unsubscribe"); // Set error message
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <h2>Email unsubscribe mock UI</h2>
      <button onClick={handleUnsubscribe}>Unsubscribe</button>
      {message && <p>{message}</p>} {/* Conditionally render the message */}
    </div>
  );
};

export default emailUnsubscribe;
