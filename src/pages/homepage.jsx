import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../../api/hooks/useAuth.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Homepage = () => {
  const { user, authChecked } = useAuth();
  const [stats, setStats] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && user) {
      if (user.is_admin === true) {
        navigate("/admin");
      }
    }
  }, [authChecked, user]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
        // fallback to empty stats if error
        setStats({
          reunitedItems: 0,
          happyUsers: 0,
          activeListings: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statData = [
    [
      stats?.reunitedItems ?? 0,
      "Items Reunited",
      "bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-700",
    ],
    [
      stats?.happyUsers ?? 0,
      "Happy Users",
      "bg-gradient-to-tr from-green-600 via-green-500 to-green-700",
    ],
    [
      stats?.activeListings ?? 0,
      "Active Listings",
      "bg-gradient-to-tr from-purple-500 via-indigo-400 to-blue-400",
    ],
    [
      "24/7",
      "Service Available",
      "bg-gradient-to-tr from-gray-700 via-blue-900 to-blue-800",
    ],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Navbar */}
      <Navbar user={user} />

      {/* Hero Section */}
      <main
        className="flex flex-1 flex-col justify-center items-center w-full px-4 pt-12 z-10"
        data-aos="fade-in"
      >
        <div className="w-full max-w-3xl text-center mb-10">
          <h1 className="font-black text-white text-5xl md:text-6xl mb-4 drop-shadow-lg tracking-tight">
            CampusFinder Lost &amp; Found
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 max-w-2xl mx-auto mb-6">
            Report, search, and recover lost items on campus—AI-powered
            connections, made simple.
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-5xl mb-12">
          <div className="flex-1 bg-white/80 rounded-2xl p-8 shadow-lg border border-blue-100 flex flex-col items-center hover:scale-105 transition">
            <span className="text-3xl mb-3">🔍</span>
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              Search Lost Items
            </h2>
            <p className="text-gray-700 mb-6">
              Browse or filter the list of items reported lost.
            </p>
            <button
              onClick={() => navigate("/search-item")}
              className="px-5 py-2 bg-blue-700 text-white rounded-full font-semibold shadow hover:bg-blue-900 transition cursor-pointer"
            >
              Search Now
            </button>
          </div>
          <div className="flex-1 bg-white/80 rounded-2xl p-8 shadow-lg border border-green-100 flex flex-col items-center hover:scale-105 transition">
            <span className="text-3xl mb-3">📢</span>
            <h2 className="text-xl font-bold text-green-900 mb-2">
              Report Found Item
            </h2>
            <p className="text-gray-700 mb-6">
              Report an item you've found—let our AI handle matching.
            </p>
            <button
              onClick={() => navigate("/post-found")}
              className="px-5 py-2 bg-green-700 text-white rounded-full font-semibold shadow hover:bg-green-900 transition cursor-pointer"
            >
              Report Found
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-blue-200 hover:text-white underline hover:scale-105 transition"
          >
            View Privacy Policy
          </button>
        </div>
      </main>

      {/* Statistics - Card Display */}
      <section className="w-full flex flex-row flex-wrap justify-center gap-8 py-10">
        {statData.map(([num, label, bg], i) => (
          <div
            key={i}
            className={`min-w-[170px] px-8 py-6 rounded-2xl shadow-lg text-white ${bg} flex flex-col items-center`}
          >
            {loading ? (
              <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            ) : (
              <>
                <span className="block text-3xl md:text-4xl font-bold mb-1">
                  {num}
                </span>
                <span className="block text-white/90 text-base">{label}</span>
              </>
            )}
          </div>
        ))}
        {showPrivacy && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div
              className="bg-white max-w-2xl w-full p-6 md:p-8 rounded-2xl shadow-2xl border border-blue-200"
              data-aos="zoom-in"
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                Privacy Policy
              </h2>

              <div className="max-h-80 overflow-y-auto pr-2 space-y-4 text-gray-700 leading-relaxed text-sm">
                <h3 className="font-semibold text-blue-800">
                  1. Information Collected
                </h3>
                <p>CAMPUSFIND may collect the following information:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>User account details (name, email, role)</li>
                  <li>
                    Item report details (descriptions, images, dates, locations)
                  </li>
                  <li>System usage data for platform improvement</li>
                </ul>

                <h3 className="font-semibold text-blue-800">
                  2. Use of Information
                </h3>
                <p>Collected data may be used to:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Facilitate lost-and-found matching</li>
                  <li>Verify ownership claims</li>
                  <li>Improve system performance and security</li>
                  <li>Generate administrative and system reports</li>
                </ul>

                <h3 className="font-semibold text-blue-800">
                  3. Data Protection
                </h3>
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    User data is securely stored and restricted to authorized
                    personnel only.
                  </li>
                  <li>
                    Technical and administrative safeguards are implemented to
                    prevent unauthorized access.
                  </li>
                </ul>

                <h3 className="font-semibold text-blue-800">4. Data Sharing</h3>
                <p>
                  Personal information is not shared with external third
                  parties, except when required by institutional policies or
                  applicable law.
                </p>

                <h3 className="font-semibold text-blue-800">
                  5. Data Retention
                </h3>
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    User and item data is retained only as long as necessary for
                    platform operation and administration.
                  </li>
                  <li>
                    Records of unclaimed items may be archived after the Claim
                    Period expires.
                  </li>
                </ul>

                <h3 className="font-semibold text-blue-800">6. User Rights</h3>
                <p>Users may request to:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Access and update their personal information</li>
                  <li>
                    Request account deletion, subject to institutional
                    guidelines
                  </li>
                </ul>

                <h3 className="font-semibold text-blue-800">
                  7. Policy Updates
                </h3>
                <p>
                  This Privacy Policy may be updated as needed. Any changes will
                  be reflected within the platform.
                </p>

                <p className="italic text-gray-600">
                  By using CAMPUSFIND, you acknowledge that you have read,
                  understood, and agreed to these Terms and Policies.
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="px-6 py-2 bg-blue-800 text-white rounded-full font-semibold shadow hover:bg-blue-900 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Homepage;
