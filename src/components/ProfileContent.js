import React, { useEffect, useState } from "react";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import styles from "../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { MdOutlineTrackChanges, MdTrackChanges } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { backendURL } from "../config";

const ProfileContent = ({ active, data }) => {
  const [name, setName] = useState(localStorage.getItem("fullName") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const updateNameURL = `${backendURL}/update-name`
  const updateProfilePictureURL = `${backendURL}/update-profile-picture`

  useEffect(() => {
    // Retrieve full name and email from local storage when the component mounts
    const fullName = localStorage.getItem("fullName");
    const userEmail = localStorage.getItem("email");
    setName(fullName);
    setEmail(userEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedFullName = localStorage.getItem("fullName");

    try {
      // Check if the name in the field is different from the one in localStorage
      if (name !== storedFullName) {
        // Send request to update full name
        const updateNameResponse = await fetch(updateNameURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName: name, email: email }),
        });

        if (updateNameResponse.ok) {
          // Update the name displayed on the screen and in localStorage
          setName(name);
          localStorage.setItem("fullName", name);
          // Display success toast
          toast.success("Full name updated successfully!");
        } else {
          // Display error toast
          toast.error("Failed to update name");
        }
      }

      // Check if profile picture was updated
      if (profilePicture !== null) {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);
        formData.append("email", email); // Include the user's email

        // Send request to update profile picture
        const updateProfilePictureResponse = await fetch(updateProfilePictureURL, {
          method: "POST",
          body: formData,
        });

        if (updateProfilePictureResponse.ok) {
          // Display success toast
          toast.success("Profile picture updated successfully!");
        } else {
          // Display error toast
          toast.error("Failed to update profile picture");
        }
      }

      // Reset profile picture state
      setProfilePicture(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Display error toast
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <div className="w-full">
      {/* profilePage */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-[150px] h-[150px] border-[3px] border-[#3ad132] rounded-full"
                />
              ) : (
                <CgProfile
                  size={35}
                  className="w-[150px] h-[150px]  border-[3px] border-[#3ad132] rounded-full "
                />
              )}
              <label
                htmlFor="profile-picture-input"
                className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]"
              >
                <AiOutlineCamera />
                <input
                  id="profile-picture-input"
                  type="file"
                  onChange={(e) =>
                    setProfilePicture(e.target.files[0])}
                  accept=".png, .jpg, .jpeg, .svg"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full  800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%] mr-4">
                  <label className="block pb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} border border-gray-300 rounded-md px-3 py-2 w-full`}
                    required
                    value={name} // Reflect the changes in the name state variable
                    onChange={(e) => setName(e.target.value)} // Update the name state variable
                  />
                </div>

                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-1 font-bold">Email Address</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    readOnly // Make the email address non-editable
                    value={email} // Display the email address
                  />
                </div>
              </div>
              <div className="flex justify-center mt-8 mx-auto">
                <input
                  className="w-[230px] h-[45px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] cursor-pointer"
                  required
                  value="Update"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </>
      )}

      {/* orderPage */}
      {active === 2 && (
        <div>
          <AllOrder />
        </div>
      )}

      {/* Refund Page */}
      {active === 3 && (
        <div>
          <AllRefundsOrder />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* change password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/* user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}

      {/* user Address */}
      {active === 8 && <div></div>}
    </div>
  );
};

const AllOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser()); // Call the action without passing userId
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order.orderItems.map((item, idx) => (
                        <span key={idx}>
                          {item.name}
                          {idx !== order.orderItems.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      ${order.totalPrice}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order.orderStatus}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <Link to={`/user/order/${order._id}`}>
                        <button className="flex items-center">
                          <AiOutlineArrowRight size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllRefundsOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser()); // Call the action without passing userId
  }, [dispatch]);

  const eligibleOrder =
    orders && orders.filter((item) => item.orderStatus === "Processing refund");

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Refunded Items
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {eligibleOrder.map((order, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order.orderItems.map((item, idx) => (
                        <span key={idx}>
                          {item.name}
                          {idx !== order.orderItems.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      ${order.totalPrice}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order.orderStatus}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <Link to={`/order/${order._id}`}>
                        <button className="flex items-center">
                          <AiOutlineArrowRight size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser()); // Call the action without passing userId
  }, [dispatch]);
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Refunded Items
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order.orderItems.map((item, idx) => (
                        <span key={idx}>
                          {item.name}
                          {idx !== order.orderItems.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      ${order.totalPrice}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order.orderStatus}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <Link to={`/track/order/${order._id}`}>
                        <button className="flex items-center">
                          <MdOutlineTrackChanges size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangePassword = ({ email }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const changePasswordURL = `${backendURL}/change-password`;
    try {
      // Send request to server to change password
      const response = await fetch(changePasswordURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing password");
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center block font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>

      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      // Simulate deletion here (temporarily)
      toast.success("Address temporarily deleted!");
      clearAddressFields(); // Clear address fields after successful submission
    }
  };
  const handleDelete = () => {
    // Implement address deletion logic here
    toast.success("Address deleted successfully!");
  };

  const clearAddressFields = () => {
    // Clear address fields
    setCountry("");
    setCity("");
    setZipCode("");
    setAddress1("");
    setAddress2("");
    setAddressType("");
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <form aria-required onSubmit={handleSubmit} className="w-full">
              <div className="w-full block p-4">
                <div className="w-full pb-2">
                  <label className="block pb-2">Country</label>
                  <select
                    name=""
                    id=""
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-[95%] border h-[40px] rounded-[5px]"
                  >
                    <option value="" className="block border pb-2">
                      choose your country
                    </option>
                    {Country &&
                      Country.getAllCountries().map((item) => (
                        <option
                          className="block pb-2"
                          key={item.isoCode}
                          value={item.isoCode}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="w-full pb-2">
                  <label className="block pb-2">Choose your City</label>
                  <select
                    name=""
                    id=""
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-[95%] border h-[40px] rounded-[5px]"
                  >
                    <option value="" className="block border pb-2">
                      choose your city
                    </option>
                    {State &&
                      State.getStatesOfCountry(country).map((item) => (
                        <option
                          className="block pb-2"
                          key={item.isoCode}
                          value={item.isoCode}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="w-full pb-2">
                  <label className="block pb-2">Address 1</label>
                  <input
                    type="address"
                    className={`${styles.input}`}
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>
                <div className="w-full pb-2">
                  <label className="block pb-2">Address 2</label>
                  <input
                    type="address"
                    className={`${styles.input}`}
                    required
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>

                <div className="w-full pb-2">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    className={`${styles.input}`}
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>

                <div className="w-full pb-2">
                  <label className="block pb-2">Address Type</label>
                  <select
                    name=""
                    id=""
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="w-[95%] border h-[40px] rounded-[5px]"
                  >
                    <option value="" className="block border pb-2">
                      Choose your Address Type
                    </option>
                    {addressTypeData &&
                      addressTypeData.map((item) => (
                        <option
                          className="block pb-2"
                          key={item.name}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className=" w-full pb-2">
                  <input
                    type="submit"
                    className={`${styles.input} mt-5 cursor-pointer bg-[#051D40] hover:bg-[#18345f] text-[#FFA500] font-bold p-2 px-4y`}
                    // className="mt-5 cursor-pointer bg-[#051D40] hover:bg- [#18345f] text-[#FFA500] font-bold p-2 px-4y rounded"
                    required
                    readOnly
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className=" text-[25px] text-center font-[600] text-[#000000ba] pb-2">
          My Address
        </h1>
        <div
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add new</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <h5 className="pl-5 font-[600]">Default</h5>
        </div>
        <div className=" pl-8 flex items-center">
          <h6>Gulshan , A22 Commercial Street</h6>
        </div>

        <div className=" pl-8 flex items-center">
          <h6>(213)768-5647</h6>
        </div>
        <div className=" min-w-[10%] pl-8 flex items-center justify-between">
          <AiOutlineDelete
            size={25}
            className="cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </div>
      {/* 
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          You not have any saved address!
        </h5>
      )} */}
    </div>
  );
};

export default ProfileContent;
