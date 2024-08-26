import React, { useState } from 'react';
import axios from 'axios';

function ChangePasswordRequest() {
  const [oldPassword, setOldPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/authenticated/changePasswordRequest',
        { oldPassword },
        { withCredentials: true }
      );
      setMessage('Password change request sent. Check your email for further instructions.');
    } catch (error) {
      setMessage('Failed to send password change request.');
    }
  };

  return (
    <>
      <h1>Change Password Request</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter old password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default ChangePasswordRequest;
