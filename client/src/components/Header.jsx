import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import userStore from "@/store/userStore";
import axios from "axios";

const Navbar = () => {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axios.get("/api/signout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Clear user from store
        setUser(null);
        // Close the mobile menu if it's open
        setIsMenuOpen(false);
        // Redirect to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Sign out failed:", error);
      // You might want to add error handling UI here
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-700 to-purple-900 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="text-white text-2xl font-bold tracking-wider hover:text-purple-200 transition-colors"
          >
            Easy Fest
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/events"
              className="text-white hover:text-purple-200 font-medium transition-colors"
            >
              Events
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-purple-300 text-white hover:bg-purple-600"
              asChild
            >
              <Link to="/create">Create Event</Link>
            </Button>

            {!user ? (
              <div className="items-center space-x-4">
                <Button
                  variant="secondary"
                  className="bg-white text-purple-700 hover:bg-purple-100"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  asChild
                >
                  <Link to="/register">Signup</Link>
                </Button>
              </div>
            ) : (
              <Button
                className="bg-purple-500 hover:bg-purple-600 text-white"
               
                onClick={handleSignOut}
              >
                SignOut
              </Button>
            )}

            <Button
              variant="ghost"
              className="text-white hover:bg-purple-600"
              asChild
            >
              <Link to="/profile">Profile</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-purple-200 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
            isMenuOpen ? "max-h-96 py-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/events"
              className="text-white hover:text-purple-200 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/create"
              className="text-white hover:text-purple-200 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Event
            </Link>
            {!user ? (
              // Show login and signup when user is not logged in
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-purple-200 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-purple-200 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              // Show signout when user is logged in
              <Link
                className="text-white hover:text-purple-200 font-medium transition-colors py-2"
                onClick={handleSignOut}
              >
                Sign Out
              </Link>
            )}
            <Link
              to="/profile"
              className="text-white hover:text-purple-200 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

