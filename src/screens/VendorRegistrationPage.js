// src/components/VendorRegistrationPage.js
import React, { useState } from "react";
import "../styles/VendorRegistrationPage.css";
import logo5 from "../logo5.png";
import { Link } from "react-router-dom";
import logincover from "../cover3.jpg";
const VendorRegistrationPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [businessLicense, setBusinessLicense] = useState(null);
  const [vatNumber, setVatNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = () => {
    console.log("Company Name:", companyName);
    console.log("Contact Person Name:", contactPersonName);
    console.log("Contact Email:", contactEmail);
    console.log("Contact Number:", contactNumber);
    console.log("Company Address:", companyAddress);
    console.log("Business License:", businessLicense);
    console.log("VAT Number:", vatNumber);
  };

  return (
    <div
      className=" h-screen"
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

        <div
          style={{
            height: "100px",
          }}
        >
          <h2 className=" text-center text-4xl font-semibold text-white ">
            Welcome to <span style={{ color: "orange" }}>Energy Matrix!</span>
          </h2>
          <h2 className=" mt-6 text-center text-3xl font-extrabold text-white">
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
            <form>
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

                <label>Contact Email:</label>
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
              </div>

              <div className="form-column right-column">
                <label>Contact Number:</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />

                <label>Company Address:</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
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
                  accept=".pdf, .doc, .docx"
                />
              </div>
              <div
                style={{
                  paddingLeft: "250px",
                }}
              >
                <button
                  type="button"
                  className="custom-button"
                  onClick={handleRegistration}
                >
                  Submit
                </button>
              </div>
              <div
                style={{
                  display: "flex",

                  marginTop: "20px",
                }}
              >
                <h4 style={{ marginRight: "8px" }}>Already have an account?</h4>
                <Link to="/vendor-login" className="text-blue-600">
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

export default VendorRegistrationPage;
