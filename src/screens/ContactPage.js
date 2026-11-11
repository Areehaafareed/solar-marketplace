import React, { useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import solar1 from "../cover2.jpg";
import styles from "../styles/styles";
import { apiRequest } from "../utils/api";

const ContactPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiRequest("/api/contact", {
        method: "POST",
        body: { firstName, lastName, email, mobile, company, city, message },
      });
      toast.success(res.message || "Quote request submitted!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setCompany("");
      setCity("");
      setMessage("");
    } catch (error) {
      toast.error(error.message || "Failed to submit quote request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className={`items-center ${styles.section} text-center text-white absolute inset-0 flex flex-col justify-center mt-20`}
        >
          <h1 className="leading-[1.2] text-5xl md:text-5xl font-[500] mt-7">
            We are Here to Help
          </h1>
          <p className="pt-3 font-[Poppins] font-[400] text-lg md:text-xl">
            Get in Touch With Us
          </p>

          <div className="border-2 border-white rounded-full transition duration-300 h-10 items-center flex mt-6">
            <a
              className="bg-transparent hover:bg-white hover:text-[#051d40] text-white font-[Poppins] font-[400] py-2 px-4 rounded-full"
              href="#contactForm"
            >
              Request More Information
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-10" id="contactForm">
        <h1 className="text-3xl font-semibold">Request More Information</h1>
        <p className="text-base text-gray-600 mt-2">
          Complete the below form and our team will contact you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label htmlFor="first_name" className="block text-base font-medium">
                First Name*:
              </label>
              <input
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="block w-full mt-1 border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-base font-medium">
                Last Name*:
              </label>
              <input
                type="text"
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="block w-full mt-1 border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-base font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full mt-1 border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-base font-medium">
                Contact No:
              </label>
              <input
                type="text"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="block w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="company" className="block text-base font-medium">
                Company:
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="block w-full mt-1 border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-base font-medium">
                City*:
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="block w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">--Select City--</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-base font-medium">
                Message:
              </label>
              <textarea
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full mt-1 border rounded px-3 py-2"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold py-2.5 px-8 rounded-full cursor-pointer uppercase text-sm disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Request a Quote"}
          </button>
        </div>
      </form>

      <div className="mt-7 w-full bg-white flex items-center justify-center py-6">
        <iframe
          title="Office Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.9219759802722!2d67.06880797413993!3d24.832341746384472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33c6a96a15555%3A0x3b7a2345c2a6be21!2sSCIT%20FORTE!5e0!3m2!1sen!2s!4v1710414225136!5m2!1sen!2s"
          width="75%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
