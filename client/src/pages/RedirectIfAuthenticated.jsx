import userStore from "@/store/userStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RedirectIfAuthenticated = () => {
  const user = userStore((state) => state.user);

  return user ? <Navigate to="/"></Navigate> : <Outlet />;
};

export default RedirectIfAuthenticated;
