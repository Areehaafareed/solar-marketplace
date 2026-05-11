import Header from "../components/Header";
import { Link } from "react-router-dom";
import solar1 from "../cover2.jpg";
import styles from "../styles/styles";

import React from "react";
import Footer from "../components/Footer";

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <Header activeHeading={4} />
        <div
          className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
          style={{
            backgroundImage: `url(${solar1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {" "}
          <div className="absolute inset-0 bg-black opacity-40 "></div>
          {/* Text container */}
          <div
            className={` items-center  ${styles.section}  text-center text-white absolute inset-0 flex flex-col justify-center mt-20`}
          >
            <h1
              className={`leading-[1.2] text-5xl md:text-5xl font-[500] mt-7`}
            >
              We are Here to Help
            </h1>
            <p className="pt-3 font-[Poppins] font-[400] text-lg md:text-xl  ">
              Get in Touch With Us
            </p>

            <div
              className={`border-2 border-white rounded-full transition duration-300 h-10 items-center flex mt-6`}
            >
              <a
                className=" bg-transparent hover:bg-white hover:text-[#051d40] text-white  font-[Poppins] font-[400] py-2 px-4 rounded-full"
                href="#contactForm"
              >
                Request More Information
              </a>
            </div>
          </div>
        </div>

        <div
          className="row se-container no-gutters align-items-center"
          id="contactForm"
        >
          <div
            className="col-md-12 text-center inner-top-spacing inner-bo"
            style={{
              fontFamily: "SFProRegular",
            }}
          >
            <br />
            <br />
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "400px",
              }}
            >
              Request More Information
            </h1>
            <p style={{ fontSize: "16px" }}>
              Complete the below form and our team will contact you shortly.
            </p>
            <br />
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <div className="w-5/12 mr-10 ml-8">
              <label htmlFor="first_name" style={{ fontSize: "18px" }}>
                First Name*:
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                className="block w-full mt-2"
              />
              <label htmlFor="last_name" style={{ fontSize: "18px" }}>
                Last Name*:
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                className="block w-full mt-2"
              />
              <label htmlFor="email" style={{ fontSize: "18px" }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full mt-2"
              />
              <label htmlFor="mobile" style={{ fontSize: "18px" }}>
                {" "}
                Contact No:
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                className="block w-full mt-2"
              />
            </div>
            <div className="w-5/12 ml-8 mr-10">
              <label htmlFor="company" style={{ fontSize: "18px" }}>
                Company:
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="block w-full mt-2"
              />
              <label htmlFor="city" style={{ fontSize: "18px" }}>
                City*:
              </label>
              <select
                id="city"
                name="city"
                required
                className="block w-full mt-3 mb-4"
              >
                <option value="">--Select City--</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Peshawar">Peshawar</option>
                {/* Add more cities here */}
              </select>
              <label htmlFor="message" style={{ fontSize: "18px" }}>
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                className="block w-full mt-3"
              ></textarea>
            </div>
          </div>
          <div className=" flex justify-center mt-4">
            <div>
              <input
                type="submit"
                value="Request a Quote"
                className="bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold py-2 px-4 rounded cursor-pointer w-48 "
                style={{
                  borderRadius: "24px",
                  lineHeight: 2,
                  fontSize: "14px",
                  fontFamily: "SFProHeavy",
                  textTransform: "uppercase",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="mt-7"
          style={{
            width: "100%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            height: "500px",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.9219759802722!2d67.06880797413993!3d24.832341746384472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33c6a96a15555%3A0x3b7a2345c2a6be21!2sSCIT%20FORTE!5e0!3m2!1sen!2s!4v1710414225136!5m2!1sen!2s"
            width="75%"
            height="450"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
