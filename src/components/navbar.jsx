import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, House } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = ({ user }) => {
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotificationCount = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/notifications/${user.user_id}/count`
      );
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionToken");
    navigate("/");
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center md:py-1">
        {/* Left: Logo */}
        <div
          className="flex items-center cursor-pointer gap-2"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png" alt="Logo" className="w-20 h-auto" />
          <span className="text-2xl font-bold text-indigo-900">CampusFind</span>
        </div>

        {/* Right: Desktop Navigation */}
        <div className="ml-auto hidden md:flex items-center space-x-10">
          <div className="flex items-center space-x-10 text-gray-700 font-medium">
            <button
              onClick={() => navigate("/home")}
              className="hover:text-indigo-600 transition-colors"
            >
              HOME
            </button>

            <button
              onClick={() => navigate("/items")}
              className="hover:text-indigo-600 transition-colors"
            >
              ITEMS
            </button>
            <button
              onClick={() => navigate("/rewards")}
              className="hover:text-indigo-600 transition-colors"
            >
              REWARDS
            </button>

            <div className="relative inline-block">
              <button
                onClick={() => navigate("/notifications")}
                className="hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                <Bell />
              </button>

              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <img
              ref={avatarRef}
              src={user?.avatar || "https://placedog.net/640/480?random"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/50"
              onClick={() => setDropdownOpen((s) => !s)}
            />

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200"
              >
                <div
                  className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                >
                  <img
                    src={user?.avatar || "https://placedog.net/640/480?random"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.full_name}
                    </p>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Mobile Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen((o) => !o)}>
            {mobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-40 md:hidden">
            <div className="flex flex-col p-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/home");
                  setMobileMenuOpen(false);
                }}
                className="text-gray-800 font-medium text-left hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/items");
                  setMobileMenuOpen(false);
                }}
                className="text-gray-800 font-medium text-left hover:text-blue-600 transition-colors"
              >
                Items
              </button>
              <button
                onClick={() => {
                  navigate("/rewards");
                  setMobileMenuOpen(false);
                }}
                className="text-gray-800 font-medium text-left hover:text-blue-600 transition-colors"
              >
                Rewards
              </button>
              <hr />
              <button
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                className="text-gray-800 font-medium text-left hover:text-blue-600 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 font-medium text-left hover:text-red-600 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
