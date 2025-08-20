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
      {/* Overlay to tint + blur the background */}
      <div className="min-h-screen bg-black/20 backdrop-blur-sm flex flex-col">
        {/* Navbar always stays at top */}
        <Navbar user={user} />

        {/* Centered Content */}
        <div className="flex flex-col items-center justify-start pt-[8vh]">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Don't panic, <br />CampusFinder's on it.
          </h1>
          <p className="text-center text-lg md:text-xl text-white max-w-lg mx-auto">
            AI-powered lost and found for School Campuses — connecting communities, reuniting people with what matters.
          </p>
          <div className="flex justify-center mt-6 pt-10">
            <button
              onClick={() => navigate("/post-found")}
              className="px-5 py-2 rounded-full bg-white text-[#01096D] font-extrabold shadow-md hover:bg-[#dbeafe] transition w-auto"
            >
              Post Found Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
