import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ChangePassword() {
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      console.log(token)

      try {
        const response = await axios.post(
            `http://localhost:3000/api/authenticated/changePasswordVerifyToken?token=${token}`,
            {},
            { withCredentials: true } // Ensure cookies are sent
          );
        if (response.status === 200) {
          console.log(response.status)
          setTokenValid(true);
        } else {
          console.log(response.status)
          navigate('/LoggedIn');
        }
      } catch (error) {
        console.log(error)
        navigate('/LoggedIn');
      }
    };

    verifyToken();
  }, [location.search, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== retypePassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/authenticated/changePasswordConfirmed',
        { newPassword: password },
        {
            withCredentials: true, // Include cookies in the request
        }
      );
      if (response.status === 200) {
        setMessage('Password successfully changed.');
      }
    } catch (error) {
      setMessage('Failed to change password.');
    }
  };

  if (!tokenValid) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Retype New Password</label>
        <input
          type="password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
