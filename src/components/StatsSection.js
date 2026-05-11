import React from "react";

const StatsSection = () => {
  return (
    <div
      className="container-fluid text-center"
      //   style={{ background: "#868686d1" }}
      style={{ background: "#051d40" }}
    >
      <div className=" flex row justify-evenly pt-5 pb-5">
        <div
          className="col-lg-2 col-md-12 col-sm-12 text-center offset-lg-3"
          style={{ color: "#FFF" }}
        >
          <div style={{ color: "#FFF" }}>
            <span className="count" style={{ color: "#FFF" }}>
              10000
            </span>
            <span className="ml-1">+</span>
          </div>
          <div style={{ fontSize: "20px" }}>Systems Installed</div>
        </div>

        <div
          className="col-lg-2 col-md-12 col-sm-12 text-center"
          style={{ color: "#FFF" }}
        >
          <div style={{ color: "#FFF" }}>
            <span className="count" style={{ color: "#FFF" }}>
              554
            </span>
            <span className="ml-2">GWh</span>
          </div>
          <div style={{ fontSize: "20px" }}>Solar Produced</div>
        </div>

        <div
          className="col-lg-2 col-md-12  col-sm-12 text-center"
          style={{ color: "#FFF" }}
        >
          <div style={{ color: "#FFF" }}>
            <span className="count" style={{ color: "#FFF" }}>
              386
            </span>
            <span className="ml-2">kTonnes</span>
          </div>
          <div style={{ fontSize: "20px" }}>
            CO<sub>2</sub> Reduced
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
