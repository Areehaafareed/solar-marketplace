import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SignupPage.css"; // Create a new CSS file for SignupPage styles
import logo5 from "../logo5.png";
import logincover from "../cover3.jpg";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    // Perform your signup logic here
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    // You may want to redirect the user or perform other actions after successful signup
  };

  return (
    <div
      className="relative h-screen "
      style={{
        backgroundImage: `url(${logincover})`,
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
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
            <form>
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
              {/* 
              <div>
                <button
                  type="submit"
                  className="custom-button"
                  onClick={handleSignup}
                >
                  Sign Up
                </button>
              </div> */}
              <button
                type="submit"
                className="custom-button"
                onClick={handleSignup}
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
