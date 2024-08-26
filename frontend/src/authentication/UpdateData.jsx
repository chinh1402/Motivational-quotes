import React, { useState } from "react";
import axios from "axios";

function UpdateData() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    country: "",
    timezone: "",
    firstName: "",
    lastName: "",
    gender: "2", // Default to "unknown" (2)
    avatarURL: "",
    birthDate: "",
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
        "http://localhost:3000/api/authenticated/updateAccountRequest",
        formData,
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      setMessage(response.data.message || "Update request sent successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred while updating data"
      );
    }
  };

  return (
    <div>
      <h2>Update Account Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />
        <input
          type="text"
          name="timezone"
          placeholder="Timezone"
          value={formData.timezone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="2">Unknown</option>
          <option value="0">Female</option>
          <option value="1">Male</option>
        </select>
        <input
          type="text"
          name="avatarURL"
          placeholder="Avatar URL"
          value={formData.avatarURL}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Birth Date"
          value={formData.birthDate}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateData;
