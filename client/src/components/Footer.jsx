import { Link } from "react-router-dom";
import {
  HeartIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
} from "lucide-react";
import { Separator } from "./ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">
              Easy Fest
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your all-in-one platform for planning, managing, and promoting
              successful events.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/AdityaG2043097"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/the.aditya_gupta/"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/coderAditya12"
                className="text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-300">
                  123 Karol Bagh,Jalandhar,India
                </span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  +91 8847339024
                </span>
              </div>
              <div className="flex items-center">
                <MailIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  support@easyfest.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-purple-100 dark:bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {currentYear} Easy Fest. All rights reserved.
          </p>
          <p className="flex items-center text-gray-500 dark:text-gray-400">
            Made with <HeartIcon className="h-4 w-4 text-red-500 mx-1" /> by the
            Easy Fest Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
