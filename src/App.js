import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  HomePage,
  VendorRegistrationPage,
  VendorLoginPage,
  ProductPage,
  SolarPackagesPage,
  SolarDetailsPage,
  ContactPage,
  FaqPage,
  CheckoutPage,
  PaymentPage,
  ProductDetailsPage,
  ProfilePage,
  OrderDetailsPage,
  OrderSuccessPage,
} from "./routes/Routes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { ShopHomePage } from "./ShopRoutes.js";
import { ShopDashboardPage } from "./routes/ShopRoute.js";
import SellerProtectedRoute from "./routes/sellerProtectedRoute.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/Loader.js";
function App() {
  const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    // Dispatch "LoadSellerRequest" action when component mounts
    dispatch({ type: "LoadSellerRequest" });

    // Simulate the user being recognized as a seller
    setTimeout(() => {
      dispatch({
        type: "LoadSellerSuccess",
        payload: {
          id: 1,
          name: "Electronics Hub",
          email: "electronicshub@gmail.com",
          description:
            "E-HUB is a comprehensive online platform dedicated to the solar energy sector. It serves as a hub for all things related to solar energy, catering to various stakeholders including consumers, solar industry professionals, and enthusiasts",
          address: "1234 Solar Street,Renewable City,Sunshine State, Solarland",
          phoneNumber: "+1 (555) 123-4567",
          createdAt: "2023-03-15",
        },
      });
    }, 2000); // Simulating a delay of 2 seconds

    return () => {
      // Cancel any pending dispatch actions here if needed
    };
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/Signup" element={<SignupPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/solarPackages" element={<SolarPackagesPage />} />
          <Route path="/solar-package/:id" element={<SolarDetailsPage />} />
          <Route path="/contactUs" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />

          {/* Vendor Routes */}
          <Route path="/vendor" element={<VendorRegistrationPage />} />
          <Route path="/vendor-login" element={<VendorLoginPage />} />
          <Route
            path="/vendor/:id"
            element={
              <SellerProtectedRoute>
                <ShopHomePage />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <SellerProtectedRoute>
                <ShopDashboardPage />
              </SellerProtectedRoute>
            }
          />
        </Routes>
      </Elements>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
