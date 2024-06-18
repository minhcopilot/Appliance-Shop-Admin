import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }: any) => {
  const navigate = useNavigate();
  const role = useAuth((state) => state.loggedInUser?.roleCode);

  useEffect(() => {
    if (role !== requiredRole) {
      navigate("/forbidden", { replace: true });
    }
  }, [role, requiredRole, navigate]);

  return role === requiredRole ? children : null;
};
export default ProtectedRoute;
