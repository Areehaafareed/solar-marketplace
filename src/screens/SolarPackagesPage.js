// SolarPackagesPage.js

import React from "react";
import Header from "../components/Header";
import styles from "../styles/styles";
import SolarPackageCard from "../components/SolarPackageCard"; // Create this component for individual solar package cards
import { solarPackagesData } from "../static/data"; // Create a data file for solar packages

const SolarPackagesPage = () => {
  return (
    <div>
      <Header activeHeading={2} />

      <div className={`${styles.section} mt-8`}>
        <div
          className="text-3xl font-bold mb-4 text-center"
          style={{ textShadow: "2px 2px 5px orange", marginTop: "20px" }}
        >
          <h1>Solar Packages</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[25px] mb-12">
          {solarPackagesData &&
            solarPackagesData.map((solarPackage, index) => (
              <SolarPackageCard key={index} data={solarPackage} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SolarPackagesPage;
