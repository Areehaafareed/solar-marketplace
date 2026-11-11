import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LoginView from "./LoginView";
import { apiRequest } from "../utils/api";
import { loginSuccessAction } from "../redux/actions/user";

const SignupView = ({ setOpen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: {
          fullName: name.trim(),
          email: email.trim(),
          password,
        },
      });
      await dispatch(loginSuccessAction(data));
      toast.success("Account created successfully!");
      setOpen(false);
      navigate("/");
    } catch (error) {
      const msg = error.message || "Error during signup";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowLoginView(false);
  };

  if (showLoginView) {
    return <LoginView setOpen={setOpen} />;
  }

  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-[#0000004b] z-50 flex items-center justify-center">
      <div className="w-[90%] 800px:w-[38%] max-w-md bg-white rounded-md shadow-lg relative p-6 max-h-[90vh] overflow-y-auto">
        <RxCross1
          size={24}
          className="absolute right-4 top-4 z-50 cursor-pointer"
          onClick={handleClose}
        />
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Create your account
        </h2>
        {errorMessage && (
          <div className="mb-3 p-2 rounded bg-red-100 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="custom-button w-full disabled:opacity-60"
          >
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
          <div className="flex items-center justify-center pt-2 text-sm">
            <span className="mr-2">Already have an account?</span>
            <button
              type="button"
              className="text-blue-600 font-medium"
              onClick={() => setShowLoginView(true)}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupView;
