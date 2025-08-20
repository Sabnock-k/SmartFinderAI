import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";

const PostFound = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

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
      {/* Overlay tint + blur */}
      <div className="min-h-screen bg-black/20 backdrop-blur-sm flex flex-col">
        {/* Navbar */}
        <Navbar user={user} />

        {/* Centered Content */}
        <div className="flex flex-col items-center justify-start pt-[8vh]">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Found Items
          </h1>
          <p className="text-center text-lg md:text-xl text-white max-w-lg mx-auto">
            Upload lost items. Help reunite owners with their belongings.
          </p>
          <div className="flex justify-center mt-6 pt-10">
            <button
              onClick={() => navigate("/upload-found")}
              className="px-5 py-2 rounded-full bg-white text-[#01096D] font-extrabold shadow-md hover:bg-[#dbeafe] transition w-auto"
            >
              Upload Found Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFound;
