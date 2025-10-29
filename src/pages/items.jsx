import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Modal Component
const ItemDetailsModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
        data-aos-duration="300"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Item Details</h2>
              {item.category && (
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {item.category}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600">Status:</span>
            {item.reunited ? (
              <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-300">
                ✓ Reunited
              </span>
            ) : item.is_approved ? (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-300">
                ● Active
              </span>
            ) : (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full border border-yellow-300">
                ⏳ Pending Approval
              </span>
            )}
          </div>

          {/* Image */}
          {item.image_url && (
            <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={item.image_url}
                alt={item.description}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-gray-800 text-base leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              {item.description}
            </p>
          </div>

          {/* Location */}
          {item.location_description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Location Found
              </h3>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="text-xl">📍</span>
                <p className="text-gray-800 flex-1">
                  {item.location_description}
                </p>
              </div>
            </div>
          )}

          {/* Date & Time */}
          {item.date_time_found && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Date & Time Found
              </h3>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="text-xl">📅</span>
                <p className="text-gray-800 flex-1">
                  {new Date(item.date_time_found).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Created At */}
          {item.created_at && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Reported On
              </h3>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="text-xl">🕐</span>
                <p className="text-gray-800 flex-1">
                  {new Date(item.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Item ID */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
            Item ID: {item.found_item_id}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Items = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedIn(true);

      if (storedUser.is_admin === true) {
        setLoggedIn(false);
        navigate("/admin");
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${API_BASE}/api/items/${user.user_id}`);
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load items", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserItems();
    }
  }, [user]);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`${API_BASE}/api/found-items/${itemId}`);
      setItems(items.filter((item) => item.found_item_id !== itemId));
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const getStatusBadge = (item) => {
    if (item.reunited) {
      return (
        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
          Reunited
        </span>
      );
    }
    if (item.is_approved) {
      return (
        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
        Pending Approval
      </span>
    );
  };

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
      <main className="flex-1 w-full px-4 py-12 z-10" data-aos="fade-in">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-black text-white text-4xl md:text-5xl mb-4 drop-shadow-lg tracking-tight">
              My Reported Items
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              View and manage all the found items you've reported
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && items.length === 0 && (
            <div className="bg-white/90 rounded-2xl p-12 shadow-lg text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Items Reported Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't reported any found items. Start helping others find
                their lost belongings!
              </p>
              <button
                onClick={() => navigate("/post-found")}
                className="px-6 py-3 bg-green-700 text-white rounded-full font-semibold shadow hover:bg-green-900 transition"
              >
                Report Found Item
              </button>
            </div>
          )}

          {/* Items Grid */}
          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.found_item_id}
                  className="bg-white/90 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                  data-aos="fade-up"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.description}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        {item.category && (
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                            {item.category}
                          </span>
                        )}
                      </div>
                      {getStatusBadge(item)}
                    </div>

                    <p className="text-gray-800 font-medium mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {item.location_description && (
                        <div className="flex items-start gap-2">
                          <span>📍</span>
                          <span className="flex-1">
                            {item.location_description}
                          </span>
                        </div>
                      )}
                      {item.date_time_found && (
                        <div className="flex items-start gap-2">
                          <span>📅</span>
                          <span className="flex-1">
                            {new Date(
                              item.date_time_found
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(item.found_item_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {!loading && items.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg">
                <span className="block text-4xl font-bold text-blue-700 mb-2">
                  {items.length}
                </span>
                <span className="text-gray-700 font-medium">Total Items</span>
              </div>
              <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg">
                <span className="block text-4xl font-bold text-green-700 mb-2">
                  {items.filter((item) => item.reunited).length}
                </span>
                <span className="text-gray-700 font-medium">Reunited</span>
              </div>
              <div className="bg-white/80 rounded-xl p-6 text-center shadow-lg">
                <span className="block text-4xl font-bold text-yellow-600 mb-2">
                  {
                    items.filter((item) => !item.is_approved && !item.reunited)
                      .length
                  }
                </span>
                <span className="text-gray-700 font-medium">Pending</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Items;
