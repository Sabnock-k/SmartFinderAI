import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/navbar.jsx';

const Homepage = () => {
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
    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 100);
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

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 z-10">
        <div
          className="w-full max-w-3xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-12 border border-white/20"
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0px)" : "translateY(40px)",
            transition: "opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4 leading-tight">
            Welcome to CampusFinder Lost &amp; Found
          </h1>
          <p className="text-center text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Your trusted platform for reporting, searching, and recovering lost items on campus. 
            Powered by AI, we connect our community to reunite people with what matters most.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
            <div className="flex-1 bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-[#283593] mb-2 flex items-center">
                <span className="mr-2">🔍</span> Search Lost Items
              </h2>
              <p className="text-gray-600 mb-4">
                Browse or search for items reported lost by others. Use filters to quickly find your belongings.
              </p>
              <button
                onClick={() => navigate("/search")}
                className="px-4 py-2 bg-gradient-to-r from-[#3949ab] to-[#1a237e] text-white rounded-lg font-semibold shadow hover:from-[#283593] hover:to-[#3949ab] transition"
              >
                Search Now
              </button>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-[#388e3c] mb-2 flex items-center">
                <span className="mr-2">📢</span> Report Found Item
              </h2>
              <p className="text-gray-600 mb-4">
                Found something? Help a fellow student by reporting it. Our AI will match it with lost reports.
              </p>
              <button
                onClick={() => navigate("/post-found")}
                className="px-4 py-2 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] text-white rounded-lg font-semibold shadow hover:from-[#1b5e20] hover:to-[#2e7d32] transition"
              >
                Report Found Item
              </button>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-6">
            <span>
              Need help? Visit our <a href="/faq" className="text-[#3949ab] underline hover:text-[#1a237e]">FAQ</a> or <a href="/contact" className="text-[#3949ab] underline hover:text-[#1a237e]">Contact Support</a>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
