import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar.jsx';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("sessionToken");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      setLoggedIn(true);
    }
  }, []);

  if (!loggedIn) {
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
        <div className="flex flex-col justify-center px-6">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-[#ECEEDF] mb-6 leading-tight">
            Dont't panic, <br />CampusFinder's on it.
          </h1>
          <p className="text-center text-lg md:text-xl text-[#ECEEDF] max-w-lg mx-auto">
            AI-powered lost and found for School Campuses — connecting communities, reuniting people with what matters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
