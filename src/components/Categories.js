import React from "react";
import styles from "../styles/styles";
import { brandingData, categoriesData } from "../static/data";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Categories = () => {
  const navigate = useNavigate();
  const slideLeft = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft -= 200; // Adjust the scroll distance as needed
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft += 200; // Adjust the scroll distance as needed
  };

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full bg-white p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-center" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <h2
        className="text-3xl font-bold mb-4 text-center"
        style={{ textShadow: "2px 2px 5px orange" }}
      >
        Categories
      </h2>
      <div className={`${styles.section} relative`}>
        <IoIosArrowBack
          size={40}
          className="cursor-pointer hover:opacity-80 absolute top-1/2  transform -translate-y-1/2"
          onClick={slideLeft}
        />
        <div
          className={`p-6 overflow-x-scroll whitespace-nowrap scrollbar-hide rounded-lg`}
          style={{
            backgroundColor: "white",
            gap: "20px",
          }}
          id="slider"
        >
          {categoriesData &&
            categoriesData.map((i) => {
              // const handleSubmit = () => {
              //   navigate(`/products?category=${i.title}`);
              // };

              return (
                <>
                  <div
                    key={i.id}
                    onClick={() => navigate(`/products?category=${i.title}`)}
                    className={`inline-block w-1/4 mx-4 transition-transform transform`}
                    style={{
                      textAlign: "center",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={i.image_Url}
                      alt="images"
                      className="w-full h-[200px] object-cover mb-2 cursor-pointer hover:scale-105 ease-in-out duration-300"
                      style={{ borderRadius: "10px" }} // Add border-radius to the image
                    />
                    <h5
                      className={`text-[16px] leading-[1.3] text-white bg-gray-900 py-2 rounded-md`}
                    >
                      {i.title}
                    </h5>
                  </div>
                </>
              );
            })}
        </div>
        <IoIosArrowForward
          size={40}
          className="cursor-pointer hover:opacity-80 absolute top-1/2 right-2 transform -translate-y-1/2"
          onClick={slideRight}
        />
      </div>
    </>
  );
};

export default Categories;
