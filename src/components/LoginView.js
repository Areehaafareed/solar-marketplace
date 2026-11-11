import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { loginSuccessAction } from "../redux/actions/user";

const LoginView = ({ setOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      await dispatch(loginSuccessAction(data));
      toast.success("Login successful!");
      setOpen(false);
      navigate("/");
    } catch (error) {
      const msg = error.message || "Invalid email or password";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-[#0000004b] z-50 flex items-center justify-center">
      <div className="w-[90%] 800px:w-[35%] max-w-md bg-white rounded-md shadow-lg relative p-6">
        <RxCross1
          size={24}
          className="absolute cursor-pointer right-4 top-4 z-50"
          onClick={handleClose}
        />
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Login to your account
        </h2>
        {errorMessage && (
          <div className="mb-3 p-2 rounded bg-red-100 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-3">
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
          <button
            type="submit"
            disabled={submitting}
            className="custom-button w-full disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
          <div className="flex items-center justify-center pt-2 text-sm">
            <span className="mr-2">Don't have any account?</span>
            <Link
              to="/Signup"
              onClick={handleClose}
              className="text-blue-600 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
