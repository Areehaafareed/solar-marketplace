import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { backendURL } from "../config";
import LoginView from "./LoginView"; // Import LoginView component

const SignupView = ({ setOpen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginView, setShowLoginView] = useState(false); // State to manage LoginView visibility
  const navigate = useNavigate();

  const signUpURL = `${backendURL}/Signup`;
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      console.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(signUpURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log("Signup successful");
        navigate("/LoginPage");
      } else {
        const errorMessage = await response.text();
        console.error("Error during signup:", errorMessage);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowLoginView(false); // Close the LoginView when SignupView is closed
  };

  return (
    <div className="bg-[#fff]">
      <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
        <div className="w-[40%] 800px:w-[40%] h-[80vh] overflow-y-scroll 800px:h-[55vh] bg-white rounded-md shadow-sm relative p-4">
          <RxCross1
            size={25}
            className="absolute right-3 top-3 z-50"
            onClick={handleClose} // Close the SignupView directly
          />
          <div className="block w-full 800px:flex">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-Black">
                Create your account
              </h2>
              <div className="w-[70%] mt-2 pl-5">
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
                  <button type="submit" className="custom-button">
                    Sign Up
                  </button>
                  <div style={{ display: "flex", marginTop: "20px" }}>
                    <h4 style={{ marginRight: "8px" }}>
                      Already have an account?
                    </h4>
                    <button
                      className="text-blue-600"
                      onClick={() => setShowLoginView(true)} // Set LoginView to be visible
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLoginView && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000030] z-50 flex items-center justify-center">
          <LoginView setOpen={setOpen} />
        </div>
      )}
    </div>
  );
};

export default SignupView;
