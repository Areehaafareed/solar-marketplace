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
  TrackOrderPage,
  OrderSuccessPage,
} from "./routes/Routes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { ShopHomePage } from "./ShopRoutes.js";
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopAllCoupons,
  ShopAllOrderDetails,
  ShopAllOrders,
  ShopAllRefunds,
} from "./routes/ShopRoute.js";
import SellerProtectedRoute from "./routes/sellerProtectedRoute.js";
import ProtectedRoute from "./ProtectedRoute.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/Loader.js";
import { loadUser } from "./redux/actions/user.js";
import { loadSeller } from "./redux/actions/seller.js";
import { getAllProducts } from "./redux/actions/product.js";
import InboxPage from "./screens/InboxPage.js";
import ShopInboxPage from "./screens/Shop/ShopInboxPage.js";
import ShopSettingsPage from "./screens/Shop/ShopSettingsPage.js";
import ShopPreviewPage from "./screens/Shop/ShopPreviewPage.js";

const stripePromise = loadStripe("pk_test_placeholder_solar_marketplace");

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadSeller());
    dispatch(getAllProducts());
  }, [dispatch]);

  if (isLoading && localStorage.getItem("vendorToken")) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Signup" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/solarPackages" element={<SolarPackagesPage />} />
          <Route path="/solar-package/:id" element={<SolarDetailsPage />} />
          <Route path="/contactUs" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/shop/:id" element={<ShopPreviewPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track/order/:id"
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />

          {/* Vendor Auth Routes */}
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

          {/* Shop Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <SellerProtectedRoute>
                <ShopDashboardPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-orders"
            element={
              <SellerProtectedRoute>
                <ShopAllOrders />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-refunds"
            element={
              <SellerProtectedRoute>
                <ShopAllRefunds />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-orders/:id"
            element={
              <SellerProtectedRoute>
                <ShopAllOrderDetails />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/order/:id"
            element={
              <SellerProtectedRoute>
                <ShopAllOrderDetails />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-create-product"
            element={
              <SellerProtectedRoute>
                <ShopCreateProduct />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-products"
            element={
              <SellerProtectedRoute>
                <ShopAllProducts />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-coupons"
            element={
              <SellerProtectedRoute>
                <ShopAllCoupons />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coupons"
            element={
              <SellerProtectedRoute>
                <ShopAllCoupons />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/dashboard-messages"
            element={
              <SellerProtectedRoute>
                <ShopInboxPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <SellerProtectedRoute>
                <ShopSettingsPage />
              </SellerProtectedRoute>
            }
          />
        </Routes>
      </Elements>
      <ToastContainer
        position="bottom-center"
        autoClose={4000}
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
};

export default App;
