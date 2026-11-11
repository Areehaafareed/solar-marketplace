import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/LoginPage.css";
import logo5 from "../logo5.png";
import logincover from "../cover.jpg";
import { apiRequest } from "../utils/api";
import { vendorLoginSuccess } from "../redux/actions/seller";

const VendorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller && localStorage.getItem("vendorToken")) {
      navigate("/dashboard");
    }
  }, [isSeller, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/api/vendor/login", {
        method: "POST",
        body: { email, password },
      });

      dispatch(vendorLoginSuccess(data));
      toast.success(`Welcome back, ${data.vendor.companyName}!`);
      navigate("/dashboard");
    } catch (error) {
      const msg = error.message || "Invalid vendor email or password";
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
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-6">
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
            Login to your Shop
          </h2>
        </div>
        <div className="flex justify-center">
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
                placeholder="vendor@company.com"
                required
              />

              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Please contact support at support@energymatrix.com to reset your vendor password.")
                    }
                    className="font-medium text-red-600 hover:text-red-500 underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="custom-button mt-4 disabled:opacity-60"
              >
                {submitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-xs text-gray-500 mt-3">
                Demo vendor: <strong>electronicshub@gmail.com</strong> / <strong>password123</strong>
              </p>

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
