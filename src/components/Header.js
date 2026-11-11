import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo5 from "../logo5.png";
import styles from "../styles/styles";
import { categoriesData } from "../static/data";
import {
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineLogout,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import Navbar from "./NavBar";
import { CgProfile } from "react-icons/cg";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import LoginView from "./LoginView";
import { toast } from "react-toastify";
import { logoutUser } from "../redux/actions/user";
import { resolveAssetUrl } from "../utils/api";

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { allProducts, packages } = useSelector((state) => state.products);

  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [loginDropDown, setLoginDropDown] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = Boolean(isAuthenticated && localStorage.getItem("customerToken"));

  useEffect(() => {
    const onScroll = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const combinedCatalog = [...(allProducts || []), ...(packages || [])];

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchData([]);
      return;
    }
    const filtered = combinedCatalog.filter(
      (item) =>
        item.name?.toLowerCase().includes(term.toLowerCase()) ||
        item.category?.toLowerCase().includes(term.toLowerCase())
    );
    setSearchData(filtered);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchData([]);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to view your cart.");
      setOpenLogin(true);
    } else {
      setOpenCart(true);
    }
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to view your profile.");
      setOpenLogin(true);
    } else {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <>
      <div className="z-20 w-full bg-white">
        <div
          className="hidden 800px:h-[90px] 800px:flex items-center justify-between px-6"
          style={{ margin: 0 }}
        >
          <div>
            <Link to="/">
              <img
                src={logo5}
                alt="logo"
                style={{ height: "90px", width: "140px" }}
              />
            </Link>
          </div>

          {/* search box */}
          <form onSubmit={handleSearchSubmit} className="w-[42%] relative">
            <input
              type="text"
              placeholder="Search solar panels, inverters, packages..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-3 pr-10 border-[#051d40] border-[2px] rounded-md"
            />
            <button type="submit" className="absolute right-2.5 top-1.5 cursor-pointer">
              <AiOutlineSearch size={26} />
            </button>

            {searchData && searchData.length !== 0 && (
              <div className="absolute left-0 right-0 top-[44px] max-h-[50vh] overflow-y-auto bg-white shadow-lg border rounded-md z-50 p-3">
                {searchData.map((i) => (
                  <Link
                    key={i.id}
                    to={i.type === "package" ? `/solar-package/${i.id}` : `/product/${i.id}`}
                    onClick={() => {
                      setSearchTerm("");
                      setSearchData([]);
                    }}
                    className="flex items-center gap-3 py-2 px-2 hover:bg-gray-100 rounded"
                  >
                    <img
                      src={resolveAssetUrl(i.image_URL)}
                      alt={i.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <h1 className="text-sm font-medium text-gray-800">{i.name}</h1>
                      <p className="text-xs text-gray-500">${i.discount_price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Auth & Vendor buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-[#051d40] hover:underline"
                >
                  Hi, {user?.fullName || localStorage.getItem("fullName") || "Customer"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
                >
                  <AiOutlineLogout size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex bg-black h-[46px] items-center justify-center rounded-xl px-2">
                <div
                  className="relative cursor-pointer"
                  onClick={() => setLoginDropDown(!loginDropDown)}
                >
                  <div className="text-white py-2 px-3 cursor-pointer text-sm font-medium">
                    Login
                  </div>
                  {loginDropDown && (
                    <div
                      className="absolute top-full left-0 bg-white w-40 py-2 rounded-md shadow-lg border z-50"
                      onMouseLeave={() => setLoginDropDown(false)}
                    >
                      <Link
                        to="/LoginPage"
                        onClick={() => setLoginDropDown(false)}
                        className="block px-3 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        Login as User
                      </Link>
                      <Link
                        to="/vendor-login"
                        onClick={() => setLoginDropDown(false)}
                        className="block px-3 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        Login as Vendor
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/Signup">
                  <div className="text-white py-2 px-3 cursor-pointer text-sm font-medium border-l border-gray-700">
                    Register
                  </div>
                </Link>
              </div>
            )}

            <div className={`${styles.button}`} style={{ width: "175px", margin: 0 }}>
              <Link to={isSeller ? "/dashboard" : "/vendor"}>
                <h1 className="text-[#fff] flex items-center text-sm font-medium">
                  {isSeller ? "Go Dashboard" : "Become a Vendor"}{" "}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop navbar */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-30" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-[#051d40] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* categories */}
          <div className="relative">
            <div
              onClick={() => setDropDown(!dropDown)}
              className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block cursor-pointer"
            >
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                type="button"
                className="h-[100%] w-full flex justify-between items-center pl-10 pr-8 bg-white font-sans text-lg font-[500] select-none rounded-t-md"
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
              />
            </div>

            {dropDown && (
              <div
                className="absolute left-0 top-[70px] w-[270px] bg-white shadow-lg rounded-b-md z-40 border"
                onMouseLeave={() => setDropDown(false)}
              >
                {categoriesData &&
                  categoriesData.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setDropDown(false);
                        navigate(`/products?category=${encodeURIComponent(cat.title)}`);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <img
                        src={resolveAssetUrl(cat.image_Url)}
                        alt={cat.title}
                        className="w-7 h-7 object-cover rounded"
                      />
                      <span className="text-sm font-medium text-gray-800">{cat.title}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* navigation items */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex items-center">
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
                title="Wishlist"
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#FFA500] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist ? wishlist.length : 0}
                </span>
              </div>
            </div>

            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={handleCartClick}
                title="Cart"
              >
                <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#FFA500] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart ? cart.length : 0}
                </span>
              </div>
            </div>

            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={handleProfileClick}
                title={isLoggedIn ? "My Profile" : "Login"}
              >
                {user?.profilePicture ? (
                  <img
                    src={resolveAssetUrl(user.profilePicture)}
                    alt="Profile"
                    className="w-[34px] h-[34px] rounded-full object-cover border border-white"
                  />
                ) : (
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                )}
              </div>
            </div>

            {openLogin && <LoginView setOpen={setOpenLogin} />}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
            {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-30" : ""
        } w-full h-[70px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between px-3">
          <BiMenuAltLeft onClick={() => setOpen(true)} size={36} className="cursor-pointer" />
          <Link to="/">
            <img
              src={logo5}
              alt="logo"
              style={{ height: "65px", width: "120px" }}
              className="cursor-pointer"
            />
          </Link>
          <div className="relative cursor-pointer mr-2" onClick={handleCartClick}>
            <AiOutlineShoppingCart size={28} />
            <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[11px] leading-tight text-center">
              {cart ? cart.length : 0}
            </span>
          </div>
        </div>

        {open && (
          <div className="fixed w-full bg-[#0000005f] z-40 h-full top-0 left-0">
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-50 overflow-y-scroll p-4">
              <div className="w-full justify-between flex items-center mb-4">
                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    setOpenWishlist(true);
                  }}
                >
                  <AiOutlineHeart size={28} />
                  <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-4 h-4 text-white font-mono text-[11px] leading-tight text-center">
                    {wishlist ? wishlist.length : 0}
                  </span>
                </div>
                <RxCross1 size={24} className="cursor-pointer" onClick={() => setOpen(false)} />
              </div>

              <form onSubmit={handleSearchSubmit} className="my-4">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>

              <Navbar active={activeHeading} />

              <div className="mt-6">
                <Link to={isSeller ? "/dashboard" : "/vendor"} onClick={() => setOpen(false)}>
                  <div className={`${styles.button} !rounded-[4px] w-full`}>
                    <h1 className="text-[#fff] flex items-center text-sm">
                      {isSeller ? "Go Dashboard" : "Become a Vendor"}{" "}
                      <IoIosArrowForward className="ml-1" />
                    </h1>
                  </div>
                </Link>
              </div>

              <div className="flex w-full justify-center mt-8 gap-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="text-[16px] text-[#051d40] font-semibold"
                    >
                      Profile
                    </Link>
                    <span>|</span>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="text-[16px] text-red-600 font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/LoginPage"
                      onClick={() => setOpen(false)}
                      className="text-[16px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/Signup"
                      onClick={() => setOpen(false)}
                      className="text-[16px] text-[#000000b7]"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
