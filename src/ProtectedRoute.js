import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./components/Loader";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const hasToken = Boolean(localStorage.getItem("customerToken"));

  if (loading && hasToken) {
    return <Loader />;
  }

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/LoginPage" replace />;
  }

  return children;
};

export default ProtectedRoute;
