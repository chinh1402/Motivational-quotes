import React, { useEffect, useState } from "react";
import axios from "axios";

function EmailConfirmed() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/authenticated/emailServiceSignupConfirmed",
          {}, // Send an empty body if not required
          {
            withCredentials: true, // Include cookies in the request if necessary
          }
        );

        setMessage(response.data.message || "Email confirmed successfully");
      } catch (error) {
        setMessage(
          error.response?.data?.error || "An error occurred during email confirmation"
        );
      }
    };

    confirmEmail();
  }, []); // Empty dependency array means this will run once when the component mounts

  return (
    <div>
      <h2>Confirm Email Service Signup</h2>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EmailConfirmed;
