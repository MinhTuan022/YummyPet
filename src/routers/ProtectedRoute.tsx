import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded?.role || "";

    const hasAccess = allowedRoles.includes(role);
    return hasAccess ? element : <Navigate to="/unauthorized" replace />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
