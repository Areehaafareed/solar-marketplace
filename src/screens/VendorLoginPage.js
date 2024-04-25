import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import logo5 from "../logo5.png";
import logincover from "../cover.jpg";
import { backendURL } from "../config";

const VendorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const vendorLoginURL = `${backendURL}/vendor-login`

    try {
      const response = await fetch(vendorLoginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      console.log(data.message); // Log success message

      // Extract vendor email and company from the response
      const { email: vendorEmail, company: vendorCompany } = data;

      // Store vendor email and company in local storage
      localStorage.setItem('vendorEmail', vendorEmail);
      localStorage.setItem('vendorCompany', vendorCompany);

      // Redirect to dashboard
      navigate(`/dashboard`);
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error (e.g., show error message to the user)
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
            Login to your Shop
          </h2>
        </div>
        <div className="flex justify-center">
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

              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-red-600 hover:text-red-500 underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <button type="submit" className="custom-button mt-4">
                Login
              </button>

              <div className="flex mt-4">
                <h4 className="mr-2">Don't have an account?</h4>
                <Link to="/vendor" className="text-blue-600">
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

export default VendorLoginPage;
