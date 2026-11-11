import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/styles";
import SolarPackageCard from "../components/SolarPackageCard";

const SolarPackagesPage = () => {
  const { packages } = useSelector((state) => state.products);

  return (
    <div>
      <Header activeHeading={2} />

      <div className={`${styles.section} mt-8 min-h-[60vh]`}>
        <div
          className="text-3xl font-bold mb-4 text-center"
          style={{ textShadow: "2px 2px 5px orange", marginTop: "20px" }}
        >
          <h1>Solar Packages</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[25px] mb-12">
          {packages &&
            packages.map((solarPackage) => (
              <SolarPackageCard key={solarPackage.id} data={solarPackage} />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SolarPackagesPage;
