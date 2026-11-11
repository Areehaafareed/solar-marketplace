import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles";
import { useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user, addresses } = useSelector((state) => state.user);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressType, setAddressType] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.fullName || "");
      setEmail((prev) => prev || user.email || "");
      setPhoneNumber((prev) => prev || user.phoneNumber || "");
    }
  }, [user]);

  const subTotalPrice = (cart || []).reduce(
    (acc, item) => acc + Number(item.qty || 1) * Number(item.discount_price || 0),
    0
  );

  const shipping = Number((subTotalPrice * 0.1).toFixed(2));

  const applySavedAddress = (addr) => {
    setAddressType(addr.addressType);
    setCountry(addr.country);
    setCity(addr.city);
    setAddress1(addr.address1);
    setAddress2(addr.address2 || "");
    setZipCode(addr.zipCode);
  };

  const paymentSubmit = () => {
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (
      !name.trim() ||
      !email.trim() ||
      !address1.trim() ||
      !zipCode.toString().trim() ||
      !country ||
      !city
    ) {
      toast.error("Please fill out your full name, email, and complete delivery address!");
      return;
    }

    const shippingAddress = {
      address1: address1.trim(),
      address2: address2.trim(),
      zipCode: zipCode.toString().trim(),
      country,
      city,
      addressType,
    };

    const orderData = {
      cart,
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phoneNumber.trim(),
      totalPrice,
      subTotalPrice: Number(subTotalPrice.toFixed(2)),
      shipping,
      discountPrice: Number(discountAmount || 0),
      shippingAddress,
    };

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const data = await apiRequest("/api/coupons/apply", {
        method: "POST",
        body: { code: couponCode.trim(), subTotalPrice },
      });
      setCouponCodeData(data.coupon);
      setDiscountPrice(data.discountAmount);
      toast.success(data.message);
    } catch (error) {
      setCouponCodeData(null);
      setDiscountPrice(0);
      toast.error(error.message || "Invalid coupon code.");
    }
  };

  const discountAmount = couponCodeData
    ? Number(((subTotalPrice * couponCodeData.value) / 100).toFixed(2))
    : Number(discountPrice || 0);

  const totalPrice = Math.max(0, subTotalPrice + shipping - discountAmount).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-6">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            addresses={addresses || []}
            applySavedAddress={applySavedAddress}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice.toFixed(2)}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountAmount}
          />
        </div>
      </div>
      <button
        type="button"
        className={`${styles.button} w-[180px] 800px:w-[280px] mt-10 text-white font-semibold`}
        onClick={paymentSubmit}
      >
        Go to Payment
      </button>
    </div>
  );
};

const ShippingInfo = ({
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  name,
  setName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  setAddress2,
  zipCode,
  setZipCode,
  addresses,
  applySavedAddress,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8 shadow-sm">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-full border h-[40px] rounded-[5px] px-2"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity("");
              }}
            >
              <option value="">Choose Your Country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">State / City</label>
            <select
              className="w-full border h-[40px] rounded-[5px] px-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose Your City</option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address 1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
        </div>
      </form>

      <h5
        className="text-[16px] text-blue-600 cursor-pointer inline-block mt-2"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose from Saved Addresses ({addresses.length})
      </h5>
      {userInfo && (
        <div className="w-full mt-2 space-y-2">
          {addresses.length === 0 ? (
            <p className="text-sm text-gray-500">No saved addresses yet. Add one in your Profile.</p>
          ) : (
            addresses.map((addr) => (
              <label
                key={addr.id}
                className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="savedAddress"
                  onChange={() => applySavedAddress(addr)}
                />
                <span className="text-sm">
                  <strong>{addr.addressType}:</strong> {addr.address1}, {addr.city}, {addr.country} ({addr.zipCode})
                </span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 shadow-sm">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Sub Total:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600] text-green-600">
          {discountPercentage > 0 ? "-$" + discountPercentage.toFixed(2) : "$0.00"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupon Code (try SOLAR10)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className="w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-4 cursor-pointer hover:bg-[#f63b60] hover:text-white transition"
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
