import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";
import Cookies from "js-cookie";
import logoIcon from "../assets/icon.png"; // Better than using a hardcoded path

// Navigation items (conditionally rendered based on admin role)
const navItems = [
  { label: "Dashboard", path: "/", key: "dashboard" },
  { label: "Merch Store", path: "/merch-store", key: "merchStore" },
  { label: "Admin Metrics", path: "/admin-metrics", key: "adminMetrics" },
  { label: "Lane Console", path: "/lane-console", key: "laneConsole" },
];

const Header = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const navigate = useNavigate();

  // Toggle state for mobile menu and profile dropdown
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /**
   * Logout handler
   * - Clears user cookie
   * - Resets user context
   * - Redirects to login
   */
  const handleLogout = () => {
    Cookies.remove("user"); // Clear session cookie
    updateUser({
      credits: 0,
      isLoggedIn: false,
      name: "",
      email: "",
      isAdmin: false,
    });
    navigate("/login"); // Redirect to login
    setProfileOpen(false); // Close dropdown
  };

  /**
   * Closes profile dropdown when clicking outside of it
   */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".relative")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoIcon}
              alt="50cube Logo"
              className="w-10 lg:w-14 h-10 lg:h-14"
            />
            <div className="text-[36px]">
              <span className="text-[#0b3b6c] font-bold">50</span>
              <span className="text-black font-bold">CUBE</span>
            </div>
          </Link>

          {/* If user is logged in, show nav and profile */}
          {user?.isLoggedIn && (
            <>
              {/* Desktop navigation */}
              <nav className="hidden lg:flex space-x-8">
                {navItems.map(
                  (item) =>
                    (user.isAdmin || item.key !== "adminMetrics") && (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        className={({ isActive }) =>
                          `py-2 ${
                            isActive
                              ? "text-[#0b3b6c] border-b-2 border-[#0b3b6c]"
                              : "text-gray-600 hover:text-[#0b3b6c]"
                          } font-bold nowrap`
                        }
                      >
                        {item.label}
                      </NavLink>
                    )
                )}
              </nav>

              {/* Credits & Profile */}
              <div className="flex items-center space-x-4">
                {/* Credits (hidden on small screens) */}
                <div className="hidden md:flex items-center">
                  <span className="text-sm text-gray-600">
                    {t("common.credits")}:
                  </span>
                  <span className="ml-1 font-medium">
                    {user.credits.toLocaleString()}
                  </span>
                </div>

                {/* Avatar/Profile Button */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center uppercase font-semibold focus:outline-none"
                  >
                    {user.name?.charAt(0) || "U"}
                  </button>

                  {/* Profile dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-4 space-y-2 z-50">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        {t("common.credits")}:
                        {user.credits.toLocaleString()}
                      </p>
                      <p className="text-sm">
                        Role: {user.isAdmin ? "Admin" : "User"}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-1.5 rounded hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Hamburger for mobile */}
                <button
                  onClick={() => setOpen(!open)}
                  className="lg:hidden focus:outline-none"
                  aria-label="Toggle Menu"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Slide-in Mobile Menu */}
              <div
                className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 lg:hidden ${
                  open ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="focus:outline-none"
                    aria-label="Close Menu"
                  >
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col space-y-6 px-6">
                  {navItems.map(
                    (item) =>
                      (user.isAdmin || item.key !== "adminMetrics") && (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            `text-lg font-bold ${
                              isActive
                                ? "text-[#0b3b6c]"
                                : "text-gray-600 hover:text-[#0b3b6c]"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      )
                  )}
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
