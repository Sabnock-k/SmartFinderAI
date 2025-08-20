import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import { X, Upload, Camera, MapPin, Calendar, Tag, Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 👈 added

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PostFound = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("sessionToken"));
  const [loggedIn, setLoggedIn] = useState(!!user && !!token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location_description: "",
    date_time_found: "",
    image_url: "",
  });

  const categories = [
    "Electronics", "Clothing", "Accessories", "Books", "Keys",
    "Bags", "Documents", "Jewelry", "Sports Equipment", "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE}/api/found-item`, {
        reported_by_user_id: user.user_id,
        description: formData.description,
        category: formData.category,
        location_description: formData.location_description,
        date_time_found: formData.date_time_found,
        image_url: formData.image_url,
      });

      toast.success("Found item uploaded successfully! 🎉");
      setIsModalOpen(false);
      setFormData({
        description: "",
        category: "",
        location_description: "",
        date_time_found: "",
        image_url: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error uploading found item. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="min-h-screen bg-black/20 backdrop-blur-sm flex flex-col">
        <Navbar user={user} />

        {/* Content */}
        <div className="flex flex-col items-center justify-start pt-[8vh]">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Found Items
          </h1>
          <p className="text-center text-lg md:text-xl text-white max-w-lg mx-auto">
            Upload lost items. Help reunite owners with their belongings.
          </p>
          <div className="flex justify-center mt-6 pt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 rounded-full bg-white text-[#01096D] font-extrabold shadow-md hover:bg-[#dbeafe] transition w-auto"
            >
              Upload Found Item
            </button>
          </div>
        </div>
      </div>

      {/* Modal with Bounce Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.8, y: -100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -100 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.4,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Upload className="w-6 h-6" />
                    Report Found Item
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the item you found..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows="3"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location Found *
                    </label>
                    <input
                      type="text"
                      name="location_description"
                      value={formData.location_description}
                      onChange={handleChange}
                      placeholder="e.g., Library 2nd floor, near the entrance"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Date and Time Found */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date & Time Found *
                    </label>
                    <input
                      type="datetime-local"
                      name="date_time_found"
                      value={formData.date_time_found}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Camera className="w-4 h-4 inline mr-1" />
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="animate-spin mr-2 w-4 h-4" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Submit Item
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PostFound;
