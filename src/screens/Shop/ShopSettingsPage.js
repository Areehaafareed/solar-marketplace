import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DashboardHeader from "../../components/shop/DashboardHeader";
import DashboardSideBar from "../../components/shop/DashboardSideBar";
import { apiRequest } from "../../utils/api";
import styles from "../../styles/styles";

const ShopSettingsPage = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (seller) {
      setCompanyName(seller.companyName || seller.name || "");
      setContactPersonName(seller.contactPersonName || "");
      setContactNumber(seller.contactNumber || seller.phoneNumber || "");
      setCompanyAddress(seller.companyAddress || seller.address || "");
      setVatNumber(seller.vatNumber || "");
      setDescription(seller.description || "");
    }
  }, [seller]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await apiRequest("/api/vendor/profile", {
        method: "PUT",
        role: "vendor",
        body: {
          companyName,
          contactPersonName,
          contactNumber,
          companyAddress,
          vatNumber,
          description,
        },
      });
      localStorage.setItem("vendorCompany", data.vendor.companyName);
      dispatch({ type: "LoadSellerSuccess", payload: data.vendor });
      toast.success("Shop settings updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update shop settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={8} />
        </div>
        <div className="w-full flex justify-center py-8 px-4">
          <div className="w-full max-w-2xl bg-white rounded-md shadow p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">Shop Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium pb-1">Shop / Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-1">Contact Person Name</label>
                <input
                  type="text"
                  required
                  value={contactPersonName}
                  onChange={(e) => setContactPersonName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-1">Company Address</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-1">VAT Number</label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-1">Shop Description</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded-[5px]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full h-[42px] bg-[#051d40] text-white rounded-md font-medium hover:bg-[#0d336b] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Shop Settings"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;
