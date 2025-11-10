import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleGuard from "./RoleGuard";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0) {
    return <RoleGuard roles={roles}>{children}</RoleGuard>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
