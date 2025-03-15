
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Link to="/create-event">Create Event</Link>
            </Button>
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
              <Link to="/signup">Signup</Link>
            </Button>
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
              to="/create-event"
              className="text-white hover:text-purple-200 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Event
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-purple-200 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white hover:text-purple-200 font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Signup
            </Link>
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

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link, useNavigate } from "react-router-dom";
// import userStore from "@/store/userStore";
// import axios from "axios";

// const Header = () => {
//   const user = userStore((state) => state.user);
//   const setUser = userStore((state) => state.setUser);
//   const navigate = useNavigate();
//   const handleSignOut = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/api/signout", {
//         withCredentials: true,
//       });
//       if (response.status === 200) {
//         setUser(null);
//         navigate("/");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <header className="w-full bg-white shadow-sm">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left side - Project Name */}
//           <div className="flex-shrink-0">
//             <h1 className="text-xl font-bold text-gray-900">Event Hub</h1>
//           </div>

//           {/* Right side - Buttons */}
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <Button variant="outline" onClick={handleSignOut}>
//                 logout
//               </Button>
//             ) : (
//               <Button variant="outline" asChild>
//                 <Link to="/login">Login</Link>
//               </Button>
//             )}
//             <Button asChild>
//               <Link to="/dashboard">Dashboard</Link>
//             </Button>
//             <Button asChild>
//               <Link to="/create">Create Event +</Link>
//             </Button>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
