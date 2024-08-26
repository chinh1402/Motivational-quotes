import React, { useState } from "react";
import axios from "axios";

function EmailConsent() {
  const [formData, setFormData] = useState({
    email: "",
    sequenceType: "daily", // Assuming 'daily' is a common sequence type
    timezone: "UTC",
    startSendingDay: "",
    lastSendingDay: "",
    sendAt: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post(
        "http://localhost:3000/api/authenticated/emailServiceSignup",
        formData,
        {
          withCredentials: true, // Include cookies in the request if necessary
        }
      );

      setMessage(response.data.message || "Successfully signed up for email service");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred during sign-up"
      );
    }
  };

  return (
    <div>
      <h2>Email Service Consent</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          name="sequenceType"
          value={formData.sequenceType}
          onChange={handleChange}
          required
        >
          <option value="daily" defaultValue>Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          {/* Add other options as needed */}
        </select>
        <input
          type="text"
          name="timezone"
          placeholder="Timezone (e.g., UTC)"
          value={formData.timezone}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="startSendingDay"
          placeholder="Start Sending Day"
          value={formData.startSendingDay}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="lastSendingDay"
          placeholder="Last Sending Day"
          value={formData.lastSendingDay}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="sendAt"
          placeholder="Send At (e.g., 05:00)"
          value={formData.sendAt}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EmailConsent;
