import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Lucide icons for burger & close

const Navbar = ({ user }) => {
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    navigate("/");
  };

  return (
    <nav className="relative flex items-center px-6 py-4 bg-transparent">
      {/* Left: Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/logo.png" alt="Logo" className="w-32 h-auto" />
      </div>

      {/* Right: Desktop Navigation */}
      <div className="ml-auto hidden md:flex items-center space-x-10">
        <div className="flex items-center space-x-10">
          <button
            onClick={() => navigate("/home")}
            className="text-white font-semibold hover:text-gray-300 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/items")}
            className="text-white font-semibold hover:text-gray-300 transition-colors"
          >
            Items
          </button>
          <button
            onClick={() => navigate("/rewards")}
            className="text-white font-semibold hover:text-gray-300 transition-colors"
          >
            Rewards
          </button>
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <img
            ref={avatarRef}
            src={user?.avatar || "https://picsum.photos/seed/picsum/200/300"}
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
                  src={
                    user?.avatar || "https://picsum.photos/seed/picsum/200/300"
                  }
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
                onClick={() => navigate("/settings")}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Settings & Privacy
              </button>
              <button
                onClick={() => navigate("/help")}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Help & Support
              </button>
              <button
                onClick={() => navigate("/display")}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Display & Accessibility
              </button>
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
      <div className="ml-auto md:hidden flex items-center space-x-4">
        <button onClick={() => setMobileMenuOpen((o) => !o)}>
          {mobileMenuOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Menu className="w-7 h-7 text-white" />
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
  );
};

export default Navbar;
