import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoggedIn() {
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/authenticated/getAccountDetails', {
          withCredentials: true,
        });
        setAccountDetails(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch account details');
        }
      }
    };

    fetchAccountDetails();
  }, [navigate]);

  const handleChangePasswordRequest = async () => {
    try {
      navigate('/ChangePasswordRequest');
    } catch (error) {
      setMessage('Failed to send password change request.');
    }
  };

  const handleConfirmUpdateRequest = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/authenticated/updateAccountRequestConfirmed',
        {}, // If any data is needed, pass it here
        {
          withCredentials: true, // Ensure the request is authenticated
        }
      );
      setMessage(response.data.message || 'Account update confirmed successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to confirm account update.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Account Details</h2>
      {accountDetails ? (
        <div>
          <p><strong>Username:</strong> {accountDetails.user.username}</p>
          <p><strong>Email:</strong> {accountDetails.user.email}</p>
          <p><strong>Account Created At:</strong> {accountDetails.user.createdAt}</p>
          <button onClick={handleChangePasswordRequest}>Change Password Request</button>
          <button onClick={() => navigate('/updateData')}>Update Data</button>
          <button onClick={handleConfirmUpdateRequest}>Confirm Account Update</button>
          <button onClick={() => navigate('/emailConsent')}>Daily email request</button>
        </div>
      ) : (
        <p>No account details available</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoggedIn;
