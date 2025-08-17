import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4">
      {/* Left: Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/logo.png" // replace with your logo path
          alt="Logo"
          className="w-32 h-auto" // adjust size as needed
        />
      </div>

      {/* Right: User Avatar */}
      <div className="relative">
        <img
          ref={avatarRef}
          src={user?.avatar || "https://picsum.photos/seed/picsum/200/300"}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
          onClick={() => setDropdownOpen((s) => !s)}
        />
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50"
          >
            <div className="bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl">
              <div
                className="flex items-center gap-3 p-4 hover:bg-white/30 cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                  setDropdownOpen(false);
                }}
              >
                <img
                  src={user?.avatar || "https://picsum.photos/seed/picsum/200/300"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user?.full_name}</p>
                  <p className="text-sm text-gray-600">@{user?.username}</p>
                </div>
              </div>
              <hr className="border-gray-200" />
              <button
                onClick={() => {
                  navigate("/settings");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-gray-800"
              >
                Settings & Privacy
              </button>
              <button
                onClick={() => {
                  navigate("/help");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-gray-800"
              >
                Help & Support
              </button>
              <button
                onClick={() => {
                  navigate("/display");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-gray-800"
              >
                Display & Accessibility
              </button>
              <hr className="border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-red-600 font-medium"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
