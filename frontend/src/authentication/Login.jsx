import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Confirm the email once the component mounts
  useEffect(() => {
    const confirmEmail = async () => {
      const email = new URLSearchParams(location.search).get("email");

      if (email) {
        try {
          await axios.post(
            `http://localhost:3000/api/signupConfirmed?email=${email}`
          );
          alert("Email verified successfully, you can login!");
        } catch (error) {
          console.log(error)
          alert(
            error.response?.data?.error ||
              "Email verification failed. Please try again."
          );
        }
      }
    };

    confirmEmail();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          loginusernameoremail: loginIdentifier,
          password,
        },
        {
          withCredentials: true, // Include cookies in the request
        }
      );
      alert(response.data.message || "Login successful");
      if (response.headers["set-cookie"]) {
        document.cookie = response.headers["set-cookie"];
      }
      navigate("/loggedIn");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username or Email"
        value={loginIdentifier}
        onChange={(e) => setLoginIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
