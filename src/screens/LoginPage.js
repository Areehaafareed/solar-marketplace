import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/LoginPage.css";
import logo5 from "../logo5.png";
import logincover from "../cover.jpg";
import { apiRequest } from "../utils/api";
import { loginSuccessAction } from "../redux/actions/user";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && localStorage.getItem("customerToken")) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
    <div
      className="relative min-h-screen"
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
          style={{ height: "100px", width: "150px" }}
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
            {errorMessage && (
              <div className="mb-3 p-2 rounded bg-red-100 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="custom-button disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Demo customer: <strong>alice.smith@gmail.com</strong> / <strong>password123</strong>
            </p>

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
