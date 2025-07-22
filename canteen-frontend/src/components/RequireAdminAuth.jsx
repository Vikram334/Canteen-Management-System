import { Navigate } from "react-router-dom";

const RequireAdminAuth = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  return token ? children : <Navigate to="/admin/login" />;
};

export default RequireAdminAuth;
