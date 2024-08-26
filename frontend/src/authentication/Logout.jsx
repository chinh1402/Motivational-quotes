import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/logout', {}, {
            withCredentials: true, // Ensure cookies are sent with the request
          });
      alert('Logout successful');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.error || 'Logout failed');
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
