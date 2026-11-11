import React, { useEffect, useState } from "react";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import styles from "../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { MdOutlineTrackChanges } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { updateUserInformation } from "../redux/actions/user";
import { apiRequest, resolveAssetUrl } from "../utils/api";
import InboxPanel from "./InboxPanel";

const ProfileContent = ({ active }) => {
  const { user, addresses } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.fullName || localStorage.getItem("fullName") || "");
  const [email, setEmail] = useState(user?.email || localStorage.getItem("email") || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePictureFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateUserInformation(name, phoneNumber));

      if (profilePictureFile) {
        const formData = new FormData();
        formData.append("profilePicture", profilePictureFile);
        formData.append("email", email);

        const picRes = await apiRequest("/api/auth/profile-picture", {
          method: "POST",
          role: "customer",
          body: formData,
        });
        dispatch({ type: "updateUserInfoSuccess", payload: picRes.user });
        setProfilePictureFile(null);
        setPreviewUrl("");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = previewUrl || (user?.profilePicture ? resolveAssetUrl(user.profilePicture) : "");

  return (
    <div className="w-full px-4">
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-[150px] h-[150px] border-[3px] border-[#3ad132] rounded-full object-cover"
                />
              ) : (
                <CgProfile
                  size={35}
                  className="w-[150px] h-[150px] border-[3px] border-[#3ad132] rounded-full text-gray-400 p-4 bg-white"
                />
              )}
              <label
                htmlFor="profile-picture-input"
                className="w-[34px] h-[34px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] shadow"
              >
                <AiOutlineCamera />
                <input
                  id="profile-picture-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".png, .jpg, .jpeg, .svg"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit}>
              <div className="w-full 800px:flex block pb-3 gap-4">
                <div className="w-full 800px:w-[50%] mb-3">
                  <label className="block pb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="w-full 800px:w-[50%] mb-3">
                  <label className="block pb-1 font-bold">Email Address</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-100"
                    readOnly
                    value={email}
                  />
                </div>
              </div>

              <div className="w-full 800px:w-[49%] mb-3">
                <label className="block pb-1 font-bold">Phone Number</label>
                <input
                  type="tel"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+92 300 0000000"
                />
              </div>

              <div className="flex justify-center mt-8 mx-auto">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-[230px] h-[45px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] cursor-pointer hover:bg-[#3a24db] hover:text-white transition disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {active === 2 && <AllOrder />}
      {active === 3 && <AllRefundsOrder />}
      {active === 4 && <InboxPanel role="customer" />}
      {active === 5 && <TrackOrderList />}
      {active === 6 && <ChangePassword />}
      {active === 7 && <Address addresses={addresses || []} />}
    </div>
  );
};

const AllOrder = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser());
  }, [dispatch]);

  if (isLoading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="flex flex-col bg-white rounded shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      {!orders || orders.length === 0 ? (
        <p className="text-gray-500 py-4">You haven't placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white border-b">
              <tr>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Order ID</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Items</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Total Price</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Status</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className={index % 2 === 0 ? "bg-gray-100 border-b" : "bg-white border-b"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {(order.orderItems || []).map((item, idx) => (
                      <span key={idx}>
                        {item.name} (x{item.qty})
                        {idx !== order.orderItems.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${order.totalPrice}
                  </td>
                  <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                    {order.orderStatus}
                  </td>
                  <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    <Link to={`/user/order/${order._id}`}>
                      <button className="flex items-center text-blue-600 hover:underline">
                        <AiOutlineArrowRight size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AllRefundsOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser());
  }, [dispatch]);

  const eligibleOrder = (orders || []).filter(
    (item) =>
      item.orderStatus === "Processing refund" || item.orderStatus === "Refund Success"
  );

  return (
    <div className="flex flex-col bg-white rounded shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">My Refunds</h2>
      {eligibleOrder.length === 0 ? (
        <p className="text-gray-500 py-4">No refund requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white border-b">
              <tr>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Order ID</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Items</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Total Price</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Status</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {eligibleOrder.map((order, index) => (
                <tr key={order._id} className={index % 2 === 0 ? "bg-gray-100 border-b" : "bg-white border-b"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {(order.orderItems || []).map((item, idx) => (
                      <span key={idx}>
                        {item.name}
                        {idx !== order.orderItems.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${order.totalPrice}
                  </td>
                  <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                    {order.orderStatus}
                  </td>
                  <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    <Link to={`/user/order/${order._id}`}>
                      <AiOutlineArrowRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const TrackOrderList = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser());
  }, [dispatch]);

  return (
    <div className="flex flex-col bg-white rounded shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">Track Orders</h2>
      {!orders || orders.length === 0 ? (
        <p className="text-gray-500 py-4">No orders to track.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white border-b">
              <tr>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Order ID</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Items</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Total Price</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Status</th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Track</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className={index % 2 === 0 ? "bg-gray-100 border-b" : "bg-white border-b"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {(order.orderItems || []).map((item, idx) => (
                      <span key={idx}>
                        {item.name}
                        {idx !== order.orderItems.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${order.totalPrice}
                  </td>
                  <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                    {order.orderStatus}
                  </td>
                  <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    <Link to={`/track/order/${order._id}`}>
                      <button className="flex items-center text-blue-600">
                        <MdOutlineTrackChanges size={20} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setSaving(true);
    try {
      await apiRequest("/api/auth/change-password", {
        method: "POST",
        role: "customer",
        body: { oldPassword, newPassword, confirmPassword },
      });

      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "An error occurred while changing password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center block font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>

      <form onSubmit={passwordChangeHandler} className="flex flex-col items-center">
        <div className="w-[100%] 800px:w-[50%] mt-5">
          <label className="block pb-2">Enter your old password</label>
          <input
            type="password"
            className={`${styles.input} mb-4`}
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="w-[100%] 800px:w-[50%] mt-2">
          <label className="block pb-2">Enter your new password</label>
          <input
            type="password"
            className={`${styles.input} mb-4`}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="w-[100%] 800px:w-[50%] mt-2">
          <label className="block pb-2">Confirm new password</label>
          <input
            type="password"
            className={`${styles.input} mb-4`}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-4 cursor-pointer hover:bg-[#3a24db] hover:text-white transition disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Address = ({ addresses }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");

  const addressTypeData = [{ name: "Default" }, { name: "Home" }, { name: "Office" }];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addressType || !country || !city || !address1 || !zipCode) {
      toast.error("Please fill all required fields!");
      return;
    }
    try {
      const res = await apiRequest("/api/addresses", {
        method: "POST",
        role: "customer",
        body: { addressType, country, city, address1, address2, zipCode },
      });
      dispatch({ type: "UpdateAddressesSuccess", payload: res.addresses });
      toast.success("Address added successfully!");
      setOpen(false);
      setCountry("");
      setCity("");
      setZipCode("");
      setAddress1("");
      setAddress2("");
      setAddressType("");
    } catch (error) {
      toast.error(error.message || "Failed to save address.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiRequest(`/api/addresses/${id}`, {
        method: "DELETE",
        role: "customer",
      });
      dispatch({ type: "UpdateAddressesSuccess", payload: res.addresses });
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete address.");
    }
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
          <div className="w-[90%] md:w-[38%] max-h-[85vh] bg-white rounded shadow relative overflow-y-scroll p-4">
            <div className="w-full flex justify-end">
              <RxCross1 size={26} className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-center text-[24px] font-Poppins mb-4">Add New Address</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block pb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCity("");
                  }}
                  className="w-full border h-[40px] rounded-[5px] px-2"
                  required
                >
                  <option value="">Choose your country</option>
                  {Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block pb-1">City / State</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border h-[40px] rounded-[5px] px-2"
                  required
                >
                  <option value="">Choose your city</option>
                  {State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block pb-1">Address 1</label>
                <input
                  type="text"
                  className={`${styles.input}`}
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-1">Address 2</label>
                <input
                  type="text"
                  className={`${styles.input}`}
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-1">Zip Code</label>
                <input
                  type="text"
                  className={`${styles.input}`}
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-1">Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full border h-[40px] rounded-[5px] px-2"
                  required
                >
                  <option value="">Choose Address Type</option>
                  {addressTypeData.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 cursor-pointer bg-[#051D40] hover:bg-[#18345f] text-[#FFA500] font-bold py-2.5 rounded"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between mb-4">
        <h1 className="text-[25px] font-[600] text-[#000000ba]">My Addresses</h1>
        <div className={`${styles.button} !rounded-md`} onClick={() => setOpen(true)}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>

      {addresses.length === 0 ? (
        <h5 className="text-center pt-8 text-[17px] text-gray-500">
          You do not have any saved addresses yet!
        </h5>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="w-full bg-white min-h-[70px] rounded-[4px] flex items-center px-4 py-3 shadow justify-between"
            >
              <div>
                <span className="font-[600] text-[#051d40]">{addr.addressType}</span>
                <p className="text-sm text-gray-700">
                  {addr.address1}
                  {addr.address2 ? `, ${addr.address2}` : ""} — {addr.city}, {addr.country} ({addr.zipCode})
                </p>
              </div>
              <AiOutlineDelete
                size={22}
                className="cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => handleDelete(addr.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
