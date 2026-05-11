import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/styles";
import solar1 from "../solar8.jpg";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage: `url(${solar1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50 "></div>

      {/* Text container */}
      <div
        className={`${styles.section} text-center text-white absolute inset-0 flex flex-col justify-center`}
      >
        <h1 className={`leading-[1.2] text-4xl md:text-6xl font-bold mb-4`}>
          Empowering a Sustainable Future with Solar Energy
        </h1>
        <p className="pt-5 font-[Poppins] font-[400] text-lg md:text-xl mb-8 ">
          Power your life with the sun. Explore our solar products for an
          eco-friendly energy solution.
        </p>
        <Link to="/products" className="inline-block ">
          <div className={`mt-5`}>
            <span className="font-[Poppins] bg-[#051d40] hover:bg-[#051d40] text-white font-bold py-2 px-4 rounded-full transition duration-300">
              Explore Our Products
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
