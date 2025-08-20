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
    <div className="relative flex items-center px-6 py-4">
      {/* Left: Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-32 h-auto"
        />
      </div>

      {/* Middle: Buttons (frosted aesthetic) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => navigate("/post-found")}
          className="px-5 py-2 rounded-full bg-white backdrop-blur-md text-[#01096D] font-bold shadow-md hover:bg-[#dbeafe] transition"
        >
          Post Found Item
        </button>
        <button
          onClick={() => navigate("/claim-lost")}
          className="px-5 py-2 rounded-full bg-white backdrop-blur-md text-[#01096D] font-bold shadow-md hover:bg-[#dbeafe] transition"
        >
          Claim Lost Item
        </button>
      </div>

      {/* Right: User Avatar */}
      <div className="ml-auto relative">
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
            className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50"
          >
            <div className="bg-white/40 backdrop-blur-lg border border-white/30 shadow-xl rounded-xl">
              <div
                className="flex items-center gap-3 p-4 hover:bg-white/30 cursor-pointer"
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
                  className="w-12 h-12 rounded-full border border-white/40"
                />
                <div>
                  <p className="font-semibold text-white">
                    {user?.full_name}
                  </p>
                  <p className="text-sm text-gray-200">@{user?.username}</p>
                </div>
              </div>
              <hr className="border-white/30" />
              <button
                onClick={() => {
                  navigate("/settings");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-white"
              >
                Settings & Privacy
              </button>
              <button
                onClick={() => {
                  navigate("/help");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-white"
              >
                Help & Support
              </button>
              <button
                onClick={() => {
                  navigate("/display");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-white"
              >
                Display & Accessibility
              </button>
              <hr className="border-white/30" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-white/30 text-red-400 font-medium"
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
