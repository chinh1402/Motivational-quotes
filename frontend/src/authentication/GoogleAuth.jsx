import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function GoogleAuth() {
  useEffect(() => {
    const authenticateGoogle = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/google/callback');
        alert(response.data.message || 'Google Authentication successful');
      } catch (error) {
        alert(error.response.data.error || 'Google Authentication failed');
      }
    };
    authenticateGoogle();
  }, []);

  return (
    <div>
      <h2>Google OAuth</h2>
      <a href="http://localhost:3000/api/google">Login with Google</a>
    </div>
  );
}

export default GoogleAuth;
