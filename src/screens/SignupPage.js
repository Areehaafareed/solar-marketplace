import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignupPage.css"; // Create a new CSS file for SignupPage styles
import logo5 from "../logo5.png";
import logincover from "../cover2.jpg";
import bcrypt from 'bcryptjs'; // Import bcrypt.js library

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Get navigate object

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Ensure all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      console.error("All fields are required");
      return;
    }

    // Ensure password and confirm password match
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

      // Send signup data to the server with hashed password
      const response = await fetch('/Signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password: hashedPassword, // Send hashed password to the server
        }),
      });

      // Check if signup was successful
      if (response.ok) {
        // Redirect to the login page after successful signup
        console.log('Signup successful');
        navigate('/LoginPage');
      } else {
        // Handle signup error
        const errorMessage = await response.text();
        console.error('Error during signup:', errorMessage);
      }
    } catch (error) {
      // Handle any errors that occur during signup
      console.error('Error during signup:', error.message);
    }
  };

  return (
    <div
      className="relative h-screen "
      style={{
        backgroundImage: `url(${logincover})`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 "></div>
      <div className="absolute inset-0 flex flex-col justify-center">
        <Link to="/">
          <img
            src={logo5}
            alt="Energy Matrix Logo"
            style={{
              height: "100px",
              width: "150px",
              marginTop: "90px",
            }}
          />
        </Link>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className=" text-center text-4xl font-semibold text-white">
            Welcome to <span style={{ color: "orange" }}>Energy Matrix!</span>
          </h2>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="signup-container">
            <form onSubmit={handleSignup}>
              <label>Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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

              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="custom-button"
              >
                Sign Up
              </button>
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                }}
              >
                <h4 style={{ marginRight: "8px" }}>Already have an account?</h4>
                <Link to="/LoginPage" className="text-blue-600">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;