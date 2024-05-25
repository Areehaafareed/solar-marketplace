import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import logo5 from "../logo5.png";
import { Link, useNavigate } from "react-router-dom";
import { backendURL } from "../config";


const LoginView = ({ setOpen, data }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Get navigate object

  const handleClose = () => {
    setOpen(false); // Close the LoginView modal
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Construct the complete backend URL dynamically
      const loginURL = `${backendURL}/login`;
      console.log(loginURL);

      // Send login credentials to the server
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Check if login was successful
      if (response.ok) {
        const data = await response.json(); // Parse response JSON
        // Set login status in local storage
        localStorage.setItem("isLoggedIn", true);
        // Store user's email and full name in local storage for easy access
        localStorage.setItem("email", data.email);
        localStorage.setItem("fullName", data.fullName);
        // Redirect to the dashboard or home page after successful login
        console.log("Login successful");
        navigate("/");
      } else {
        // Handle login error
        const errorMessage = await response.text();
        console.error("Error during login:", errorMessage);
        // You can display an error message to the user here
      }
    } catch (error) {
      // Handle any errors that occur during login
      console.error("Error during login:", error.message);
    }
  };



  return (
    <div className="bg-[#fff]">
      <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
        <div className="w-[40%] 800px:w-[35%] h-[80vh] overflow-y-scroll 800px:h-[55vh] bg-white rounded-md shadow-sm relative p-4">
          <RxCross1
            size={25}
            className="absolute cursor-pointer right-3 top-3 z-50"
            onClick={handleClose} // Modified onClick handler
          />
          <div className="block w-full 800px:flex">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-Black">
                Login to your account
              </h2>
              <div className="w-[90%] mt-2 pl-5">
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
                  <button type="submit" className="custom-button">
                    Login
                  </button>
                  <div className="flex">
                    <h4 style={{ marginRight: "8px", marginTop: "20px" }}>
                      Don't have any account?
                    </h4>
                    <Link to="/signup" className="text-blue-600 mt-5">
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginView;
