import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/VendorRegistrationPage.css";
import logo5 from "../logo5.png";
import logincover from "../cover3.jpg";
import { apiRequest } from "../utils/api";
import { vendorLoginSuccess } from "../redux/actions/seller";

const VendorRegistrationPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [businessLicense, setBusinessLicense] = useState(null);
  const [vatNumber, setVatNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!companyName.trim() || !contactPersonName.trim() || !contactEmail.trim() || !password) {
      const msg = "Company name, contact person, email, and password are required.";
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
      const formData = new FormData();
      formData.append("companyName", companyName.trim());
      formData.append("contactPersonName", contactPersonName.trim());
      formData.append("contactEmail", contactEmail.trim());
      formData.append("contactNumber", contactNumber.trim());
      formData.append("companyAddress", companyAddress.trim());
      formData.append("vatNumber", vatNumber.trim());
      if (businessLicense) {
        formData.append("businessLicense", businessLicense);
      }
      formData.append("password", password);

      const data = await apiRequest("/api/vendor/register", {
        method: "POST",
        body: formData,
      });

      dispatch(vendorLoginSuccess(data));
      toast.success("Vendor registered successfully! Welcome to your Shop Dashboard.");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.message || "Failed to register vendor";
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

        <div className="mb-4">
          <h2 className="text-center text-4xl font-semibold text-white">
            Welcome to <span style={{ color: "orange" }}>Energy Matrix!</span>
          </h2>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
            Vendor Registration
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="registration-container">
            {errorMessage && (
              <div className="mb-3 p-2 rounded bg-red-100 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegistration}>
              <div className="form-column left-column">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />

                <label>Contact Person Name:</label>
                <input
                  type="text"
                  value={contactPersonName}
                  onChange={(e) => setContactPersonName(e.target.value)}
                  required
                />

                <label>Contact Number:</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />

                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <label>Business License (Upload):</label>
                <input
                  type="file"
                  onChange={(e) => setBusinessLicense(e.target.files[0])}
                  accept=".pdf, .doc, .docx, .png, .svg, .jpg, .jpeg"
                />
              </div>

              <div className="form-column right-column">
                <label>Company Address:</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />

                <label>Contact Person Email:</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />

                <label>VAT Number (if applicable):</label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                />

                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col items-center w-full mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="custom-button disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>

                <div style={{ display: "flex", marginTop: "16px" }}>
                  <h4 style={{ marginRight: "8px" }}>Already have an account?</h4>
                  <Link to="/vendor-login" className="text-blue-600">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationPage;
