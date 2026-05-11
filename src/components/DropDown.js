// DropDown.js
import React from "react";
import { Link } from "react-router-dom";

const DropDown = ({ isOpen, closeDropDown, options }) => {
  if (!isOpen) return null;

  return (
    <div className=" flex absolute right-0 mt-2 bg-black border rounded-md shadow-lg">
      <div className="px-2 py-2  flex">
        {options.map((option) => (
          <Link
            key={option.path}
            to={option.path}
            onClick={() => closeDropDown()}
            className="block px-4 py-2 text-white hover:bg-gray-800 cursor-pointer"
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropDown;
