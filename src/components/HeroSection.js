import "@fortawesome/fontawesome-free/css/all.css";

import React from "react";
import solarImage from "../solar9.jpg";

const HeroSection = () => {
  return (
    <div
      className="relative h-screen flex items-center"
      style={{
        backgroundImage: `url(${solarImage})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        marginTop: "40px",
      }}
    >
      {/* Black overlay only for the background image */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="container mx-auto absolute inset-0 flex flex-col justify-center text-white">
        <div className="row top-0 left-0 w-1/2 p-8">
          <div className="col-md-12  bg-[#051d40] text-white p-8 rounded-lg">
            <div id="column_r6oKu" className="hc_column_cnt">
              <div className="row">
                <div className="col-md-12 mb-4 hc_title_tag_cnt">
                  <h1 id="q737w" className="text-3xl font-bold">
                    Explore the Energy Matrix
                  </h1>
                </div>
                <div className="col-md-12 hc_text_block_cnt">
                  <div id="eyQdg" className="text-base">
                    Welcome to our Energy Matrix platform where you can discover
                    sustainable energy solutions provided by leading vendors.
                    Explore our range of solar packages tailored to meet your
                    energy needs.
                  </div>
                </div>
                <div className="col-md-12 hc_space_cnt">
                  <hr className="my-6" />
                </div>
                <div className="col-md-12 hc_grid_table_cnt">
                  <table className="grid-table border-table">
                    <tbody>
                      <tr className="mb-4">
                        <td className="pr-4">
                          <div className="counter-box-icon icon-box text-left">
                            <div className="icon-box-cell">
                              <i className="icon text-xl fa fa-solar-panel"></i>
                            </div>
                            <div className="icon-box-cell">
                              <b>
                                <label
                                  className="counter text-lg font-bold text-[#ffa500] "
                                  data-to="3"
                                  data-separator=""
                                  data-trigger="null"
                                >
                                  3
                                </label>
                              </b>
                              <p className="text-sm">Trusted Vendors</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="counter-box-icon icon-box text-left">
                            <div className="icon-box-cell">
                              <i className="icon text-xl fa fa-bolt"></i>
                            </div>
                            <div className="icon-box-cell">
                              <b>
                                <label
                                  className="counter text-lg font-bold text-[#ffa500] "
                                  data-to="10"
                                  data-separator=""
                                  data-trigger="null"
                                >
                                  10
                                </label>
                              </b>
                              <p className="text-sm">Solar Packages</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
