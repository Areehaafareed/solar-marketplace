import { apiRequest } from "../../utils/api";

export const loadSeller = () => async (dispatch) => {
  const token = localStorage.getItem("vendorToken");
  if (!token) {
    dispatch({ type: "LoadSellerFail", payload: null });
    return;
  }

  try {
    dispatch({ type: "LoadSellerRequest" });
    const data = await apiRequest("/api/vendor/me", { role: "vendor" });
    localStorage.setItem("vendorEmail", data.vendor.contactEmail);
    localStorage.setItem("vendorCompany", data.vendor.companyName);
    dispatch({ type: "LoadSellerSuccess", payload: data.vendor });
  } catch (error) {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorCompany");
    dispatch({ type: "LoadSellerFail", payload: error.message });
  }
};

export const vendorLoginSuccess = (data) => (dispatch) => {
  localStorage.setItem("vendorToken", data.token);
  localStorage.setItem("vendorEmail", data.vendor.contactEmail);
  localStorage.setItem("vendorCompany", data.vendor.companyName);
  dispatch({ type: "LoadSellerSuccess", payload: data.vendor });
};

export const logoutSeller = () => (dispatch) => {
  localStorage.removeItem("vendorToken");
  localStorage.removeItem("vendorEmail");
  localStorage.removeItem("vendorCompany");
  dispatch({ type: "LogoutSellerSuccess" });
};
