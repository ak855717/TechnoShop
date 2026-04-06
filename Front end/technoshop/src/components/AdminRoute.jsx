import { Navigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function AdminRoute({ children }) {
  const { isLoggedIn, user } = useShop();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
