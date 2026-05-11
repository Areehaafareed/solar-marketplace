import React from "react";
import styles from "../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-10 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-center">
          <img
            src={process.env.PUBLIC_URL + "/Assets/hub.jpg"}
            alt="hub"
            style={{ width: "50%", objectFit: "contain" }}
          />
        </div>

        <div className="flex flex-col items-center">
          <img
            src={process.env.PUBLIC_URL + "/Assets/smart.png"}
            alt="smart"
            style={{ width: "50%", objectFit: "contain" }}
          />
          <span className="company-name">Smart Solarz Solution</span>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={process.env.PUBLIC_URL + "/Assets/dawson.jpg"}
            alt="Dawson"
            style={{ width: "40%", marginTop: "10px", objectFit: "contain" }}
          />
        </div>
        <div className="flex flex-col items-center">
          <img
            src={process.env.PUBLIC_URL + "/Assets/skyelectric.jpg"}
            alt="skyelectric"
            style={{ width: "50%", objectFit: "contain" }}
          />
        </div>
        <div className="flex flex-col items-center">
          <img
            src={process.env.PUBLIC_URL + "/Assets/aurora.jpg"}
            alt="aurora"
            style={{ width: "50%", objectFit: "contain" }}
          />
          <span className="company-name">Aurora Corporation</span>
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
