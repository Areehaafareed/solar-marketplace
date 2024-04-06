import React, { useState } from "react";
import "../styles/LoginPage.css";
import { Link } from "react-router-dom";
import logo5 from "../logo5.png";
import logincover from "../cover.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform your authentication logic here
    console.log("Email:", email);
    console.log("Password:", password);
    // You may want to redirect the user or perform other actions after successful login
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
      <div className="absolute inset-0 bg-black opacity-50 "></div>
      <div className="absolute inset-0 flex flex-col justify-center ">
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
            <form>
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    // alignItems: "center",
                    marginRight: "100px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="h-3 w-3 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href=".forgot-password"
                    className="font-medium text-red-600 hover:text-red-500 underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="custom-button"
                onClick={handleLogin}
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
    </div>
  );
};

export default LoginPage;
