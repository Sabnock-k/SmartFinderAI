import { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedIn(true);
    }
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-lg font-medium">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Navbar */}
      <div className="z-20">
        <Navbar user={user} />
      </div>

      {/* Profile Content */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 z-10">
        <div
          className="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-12 border border-white/20"
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0px)" : "translateY(40px)",
            transition: "opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#3949ab] to-[#1a237e] flex items-center justify-center shadow-lg mb-4 overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-white font-bold">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-[#1a237e] mb-1">{user.name}</h2>
            <span className="text-gray-600 text-lg">{user.email}</span>
            {user.user_id && (
              <span className="text-gray-500 text-sm mt-1">Student ID: {user.user_id}</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 shadow">
              <h3 className="text-lg font-semibold text-[#283593] mb-2 flex items-center">
                <span className="mr-2">📦</span> Items Reported Found
              </h3>
              <p className="text-3xl font-bold text-[#1a237e]">12</p>
              <p className="text-gray-500 text-sm">Total items you have reported as found.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 shadow">
              <h3 className="text-lg font-semibold text-[#388e3c] mb-2 flex items-center">
                <span className="mr-2">🔎</span> Items Reported Lost
              </h3>
              <p className="text-3xl font-bold text-[#388e3c]">5</p>
              <p className="text-gray-500 text-sm">Total items you have reported as lost.</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 shadow mb-4">
            <h4 className="text-md font-semibold text-[#3949ab] mb-2">Profile Details</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li><span className="font-medium">Full Name:</span> {user.full_name}</li>
              <li><span className="font-medium">Email:</span> {user.email}</li>
              {user.user_id && (
                <li><span className="font-medium">Student ID:</span> {user.user_id}</li>
              )}
              {/* Add more fields as needed */}
            </ul>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-4 py-2 bg-gradient-to-r from-[#3949ab] to-[#1a237e] text-white rounded-lg font-semibold shadow hover:from-[#283593] hover:to-[#3949ab] transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;