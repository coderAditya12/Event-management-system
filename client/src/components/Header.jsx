import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import userStore from "@/store/userStore";
import axios from "axios";

const Header = () => {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/signout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data.message);
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="w-full bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Project Name */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Event Hub</h1>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Button variant="outline" onClick={handleSignOut}>
                logout
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
            <Button>Dashboard</Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
