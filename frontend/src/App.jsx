import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './authentication/Signup';
import Login from './authentication/Login';
import Logout from './authentication/Logout';
import GoogleAuth from './authentication/GoogleAuth';
import LoggedIn from './authentication/LoggedIn';
import ChangePasswordRequest from './authentication/ChangePasswordRequest';
import ChangePassword from './authentication/ChangePassword';
import UpdateData from './authentication/UpdateData';
import EmailConsent from './authentication/EmailConsent';
import EmailConfirmed from './authentication/EmailConfirmed';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Authentication System</h1>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/google/callback" element={<GoogleAuth />} />
          <Route path="/loggedIn" element={<LoggedIn />} />
          <Route path="/changePasswordRequest" element={<ChangePasswordRequest />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/updateData" element={<UpdateData />} />
          <Route path="/emailConsent" element={<EmailConsent />} />
          <Route path="/emailConfirmed" element={<EmailConfirmed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
