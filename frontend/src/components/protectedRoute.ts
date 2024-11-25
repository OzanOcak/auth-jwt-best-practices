import { useStore } from "@/stores/useAuthStore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const navigate = useNavigate();
  const role = useStore((state) => state.role); // Subscribe to role from Zustand store
  console.log(role);

  useEffect(() => {
    // Check if the user has the required roles
    const hasAccess = requiredRoles.includes(role);

    if (!hasAccess) {
      // Redirect to home or a not authorized page
      navigate("/");
    }
  }, [role, requiredRoles, navigate]); // Dependencies for useEffect

  // If the user does not have access, the component will navigate
  // If the user has access, render the children
  return requiredRoles.includes(role) && children;
};

export default ProtectedRoute;
