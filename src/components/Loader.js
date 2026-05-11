import React from "react";
import Lottie from "react-lottie";
import animationData from "../loader.json";

const Loader = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full items-center flex justify-center h-screen ">
      <Lottie options={defaultOptions} width={300} height={300} />
    </div>
  );
};

export default Loader;
