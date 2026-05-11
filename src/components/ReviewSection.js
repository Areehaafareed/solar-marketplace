// ReviewSection.js

import React, { useState } from "react";
import "../styles/ReviewSection.css"; // Import your CSS file

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Shahid Latif",
      location: "Peshawar",
      power: "5 kW",
      content: (
        <p className="mb-0">
          I've been utilizing the Energy Matrix 5 kW
          <br />
          Smart Solar System for over a year
          <br />
          and I'm extremely pleased with its performance. The team at Energy
          Matrix has demonstrated utmost professionalism, competence, and
          unwavering support. Their responsiveness to customer needs is
          commendable. I've consistently received top-notch technical support
          and service. Energy Matrix has proven to be a reliable partner, never
          letting me down in any situation.
        </p>
      ),
    },
    {
      id: 2,
      name: "Dr. Fahad",
      location: "Lahore",
      power: "5 kW",
      content: (
        <p>
          Energy Matrix exceeded my expectations! <br />
          The user-friendly interface and efficient monitoring make it a
          must-have for anyone looking to optimize their energy consumption. I
          highly recommend it!,
        </p>
      ),
    },

    {
      id: 3,
      name: "Usman Khan",
      location: "Islamabad",
      power: "12 kW",
      content: (
        <p>
          As a user of the Energy Matrix platform
          <br /> I can confidently say that it has transformed the way I
          approach energy consumption. The platform's intuitive design, coupled
          with reliable performance, has made it an integral part of my daily
          life. The features, such as real-time monitoring and smart
          notifications, provide a seamless experience. Energy Matrix has truly
          empowered me to take control of my energy usage and contribute to a
          sustainable future.
        </p>
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="testimonial-container " id="review">
      <h2 className="text-3xl font-bold mb-4 text-center mt-6">
        What Our Customers Say...
      </h2>
      <p className="carousel-text  mb-4 text-center">
        See what our customers say about our company & the product
      </p>

      <div className="reviews-wrapper">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`review-card ${index === currentIndex ? "center" : ""}`}
          >
            <div className="review-content">
              <img
                className="stars-spacing"
                src="https://s3.amazonaws.com/se-website-assets/img/stars.png"
                alt="Stars"
              />
              <p className="mb-0">{review.content}</p>
              <img
                className="user-placeholder"
                src="https://s3.amazonaws.com/se-website-assets/img/user-placeholder.png"
                alt="User"
              />
              <h5>{review.name}</h5>
              <h5>{`Resident | ${review.location} | ${review.power}`}</h5>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button className="control-btn prev-btn" onClick={handlePrev}>
          Previous
        </button>
        <button className="control-btn next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
