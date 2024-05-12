import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo5 from "../logo5.png";
import styles from "../styles/styles";
import { solarProducts, wishlist } from "../static/data";
import {
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineEye,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import Navbar from "./NavBar";
import { CgProfile } from "react-icons/cg";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import LoginView from "./LoginView";

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { cart } = useSelector((state) => state.cart);
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [loginDropDown, setLoginDropDown] = useState(false);
  const [open, setOpen] = useState(false);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      solarProducts &&
      solarProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  useEffect(() => {
    setActive(window.scrollY > 70);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCartClick = () => {
    if (!isLoggedIn) {
      // Prompt user to log in
      alert("Please log in to view cart.");
    } else {
      // Open cart
      setOpenCart(true);
    }
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      // Prompt user to log in
      alert("Please log in to view profile.");
    } else {
      // Navigate to profile page
      navigate("/profile");
    }
  };

  const LoginAndRegister = ({ isLoggedIn }) => {
    const [loginDropDown, setLoginDropDown] = useState(false);
  };

  const handleLoginClick = () => {
    setLoginDropDown(!loginDropDown);
  };

  return (
    <>
      <div
        className={"z-10"}
        style={{
          width: "100%",
        }}
      >
        <div
          className="hidden 800px:h-[100px] 800px:my-[20px] 800px:flex items-center justify-between"
          style={{ margin: 0 }}
        >
          <div>
            <Link to="/">
              <img
                src={logo5}
                alt="logo"
                style={{
                  height: "100px",
                  width: "150px",
                  marginTop: "-10px",
                }}
              />
            </Link>
          </div>

          {/* search box */}
          {!isLoggedIn ? (
            <div className="w-[50%] relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-2 border-[#051d40] border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-3 top-1.5 cursor-pointer"
              />

              {searchData && searchData.length !== 0 ? (
                <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                  {searchData &&
                    searchData.map((i, index) => {
                      return (
                        <Link to={`/product/${i.id}`}>
                          <div className="w-full flex items-start-py-3">
                            <h1>{i.name}</h1>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center ">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-[45%] px-2 border-[#051d40] border-[2px] rounded-md pr-20 "
              />
              <AiOutlineSearch size={30} className="ml-2 cursor-pointer" />
            </div>

          )}

          {!isLoggedIn && (
            <div className="flex w-[170px] bg-black h-[50px] items-center justify-center rounded-xl cursor-pointer">
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setLoginDropDown(!loginDropDown)}
              >
                <div className="text-white py-4 px-4 cursor-pointer">Login</div>
                {loginDropDown && (
                  <div
                    className="absolute top-full left-0 bg-white w-36 py-2 rounded-md shadow-md z-20"
                    onMouseLeave={() => setLoginDropDown(false)}
                  >
                    <Link
                      to="/LoginPage"
                      className="block px-2 py-2 text-black"
                    >
                      Login as User
                    </Link>
                    <Link
                      to="/vendor-login"
                      className="block px-2 py-2 text-black"
                    >
                      Login as Vendor
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative cursor-pointer ">
                <Link to="/Signup">
                  <div className="text-white py-4 px-4 cursor-pointer">
                    Register
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Become a vendor button */}
          {!isLoggedIn && (
            <div
              className={`${styles.button} `}
              style={{ width: "170px", marginRight: "20px" }}
            >
              <Link to="/vendor">
                <h1 className="text-[#fff] flex items-center">
                  Become a Vendor <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#051d40] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* categories */}
          <div>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>

              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
            </div>
          </div>

          {/* navigation items */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#FFA500] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={handleCartClick}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#FFA500] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer mr-[15px]" onClick={handleProfileClick}>
                <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } w-full h-[70px] bg-[#fff]  z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              onClick={() => setOpen(true)}
              size={40}
              className="ml-3"
            />
          </div>
          <div>
            <Link to="/">
              <img
                src={logo5}
                alt="logo"
                style={{
                  height: "70px",
                  width: "130px",
                }}
                className="cursor-pointer"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span class="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[60%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div className="relative  mr-[15px]">
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span class="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      3
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={26}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px]">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && searchData.length !== 0 ? (
                  <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                    {searchData &&
                      searchData.map((i, index) => {
                        return (
                          <Link to={`/product/${i.id}`}>
                            <div className="w-full flex items-start-py-3">
                              <h1>{i.name}</h1>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                ) : null}
              </div>

              <Navbar active={activeHeading} />

              {/* Become a vendor button */}
              {!isLoggedIn && (
                <div
                  className={`${styles.button} ml-4 !rounded-[4px]`}
                  style={{ width: "170px", marginRight: "20px" }}
                >
                  <Link to="/vendor">
                    <h1 className="text-[#fff] flex items-center">
                      Become a Vendor <IoIosArrowForward className="ml-1" />
                    </h1>
                  </Link>
                </div>
              )}

              <br />
              <br />
              <br />
              <div className="flex w-full justify-center">
                <Link
                  to="/LoginPage"
                  className="text-[18px] pr-[10px] text-[#000000b7]"
                >
                  Login /
                </Link>

                <Link to="/SignUp" className="text-[18px] text-[#000000b7]">
                  Signup
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
