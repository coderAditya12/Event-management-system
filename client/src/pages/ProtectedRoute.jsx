import userStore from "@/store/userStore.js";
import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  return user ? <Outlet /> : navigate("/login");
};

export default ProtectedRoute;
