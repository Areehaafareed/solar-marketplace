import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/SignupPage.css";
import logo5 from "../logo6.png";
import logincover from "../cover2.jpg";
import { apiRequest } from "../utils/api";
import { loginSuccessAction } from "../redux/actions/user";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      const msg = "All fields are required.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErrorMessage(msg);
      toast.error(msg);
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
      toast.success("Account created successfully! Welcome to Energy Matrix.");
      navigate("/");
    } catch (error) {
      const msg = error.message || "Error during signup";
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
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-6">
        <Link to="/">
          <img
            src={logo5}
            alt="Energy Matrix Logo"
            style={{
              height: "70px",
              width: "110px",
              marginTop: "0px",
            }}
          />
        </Link>
        <h2 className="text-center text-3xl font-semibold text-white mb-4">
          Welcome to <span style={{ color: "orange" }}>Energy Matrix!</span>
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="signup-container">
            <h4 className="text-center text-2xl font-bold text-black mb-2">
              Create your account
            </h4>

            {errorMessage && (
              <div className="mb-3 p-2 rounded bg-red-100 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignup}>
              <label>Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />

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
                placeholder="At least 6 characters"
                required
              />

              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="custom-button disabled:opacity-60"
              >
                {submitting ? "Creating Account..." : "Sign Up"}
              </button>

              <div style={{ display: "flex", marginTop: "12px" }}>
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
