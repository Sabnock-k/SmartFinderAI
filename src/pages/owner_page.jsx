import React, { useState, useEffect, useRef } from "react";
import Navbar from '../components/navbar.jsx';


const OwnerPage = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("sessionToken");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-lg font-medium">Please login to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    // Background image container
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: "url('/background.png')",
      }}
    >
      {/* Overlay to tint + blur the background a bit (frosted effect) */}
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        {/* Top Navigation */}
        <Navbar user={user} />
        {/* Page Content (center column with frosted card) */}
        <div className="flex justify-center px-6">
          <div className="w-full max-w-3xl mt-8 p-6 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-md">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.full_name}!</h1>
            <p className="mt-2 text-gray-700">Test page.</p>

            <div className="mt-6 p-4 bg-white/40 rounded-md border border-gray-100">
              <p className="text-gray-700"><strong>Username:</strong> {user.username}</p>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700 break-words"><strong>Session Token:</strong> {token}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPage;
