import React from "react";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
}) => {
  const { user } = useAuth();
  if (!user) return null;
  if (!roles.includes(user.role))
    return <div className="card">Access denied</div>;
  return <>{children}</>;
};

export default RoleGuard;
