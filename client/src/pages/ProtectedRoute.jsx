import userStore from "@/store/userStore.js";
import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
   return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
