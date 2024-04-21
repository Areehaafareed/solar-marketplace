import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import logo5 from "../logo5.png";
import logincover from "../cover.jpg";
import { backendURL } from "../config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Get navigate object

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Construct the complete backend URL dynamically
      const loginURL = `${backendURL}/login`;
      console.log(loginURL);
      
      // Send login credentials to the server
      const response = await fetch(loginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Check if login was successful
      if (response.ok) {
        // Set login status in local storage
        localStorage.setItem('isLoggedIn', true);
        // Redirect to the dashboard or home page after successful login
        console.log('Login successful');
        navigate('/');
      } else {
        // Handle login error
        const errorMessage = await response.text();
        console.error('Error during login:', errorMessage);
        // You can display an error message to the user here
      }
    } catch (error) {
      // Handle any errors that occur during login
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div
      className="relative h-screen"
      style={{
        backgroundImage: `url(${logincover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Link to="/">
        <img
          src={logo5}
          alt="Energy Matrix Logo"
          style={{
            height: "100px",
            width: "150px",
          }}
        />
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-semibold text-white">
          Welcome to <span style={{ color: "orange" }}>Energy Matrix!</span>
        </h2>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Login to your account
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="login-container">
          <form onSubmit={handleLogin}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="custom-button"
            >
              Login
            </button>

            <div className="flex">
              <h4 style={{ marginRight: "8px", marginTop: "20px" }}>
                Don't have any account?
              </h4>
              <Link to="/Signup" className="text-blue-600 mt-5">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
