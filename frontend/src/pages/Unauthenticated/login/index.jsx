import React from 'react';

const GoogleSignupButton = () => {
  const handleGoogleSignup = () => {
    // Redirect directly to the backend to initiate Google OAuth
    window.location.href = 'http://localhost:3000/api/google';
  };

  return (
    <button
      onClick={handleGoogleSignup}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      Sign Up with Google
    </button>
  );
};

export default GoogleSignupButton;
