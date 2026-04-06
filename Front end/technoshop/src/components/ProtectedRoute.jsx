import { Navigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useShop();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
