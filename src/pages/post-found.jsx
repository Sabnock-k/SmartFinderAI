import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import { X, Upload, Camera, MapPin, Calendar, Tag } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PostFound = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("sessionToken"));
  const [loggedIn, setLoggedIn] = useState(!!user && !!token);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location_description: "",
    date_time_found: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE}/api/found-item`, {
        reported_by_user_id: user.user_id, // taken from logged in user object
        description: formData.description,
        category: formData.category,
        location_description: formData.location_description,
        date_time_found: formData.date_time_found,
        image_url: formData.image_url, // just a link
      });

      alert("Found item uploaded successfully!");
      setIsModalOpen(false);
      setFormData({
        description: "",
        category: "",
        location_description: "",
        date_time_found: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      alert("Error uploading found item.");
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-[#01096D] mb-4">
              Upload Found Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Description */}
              <div className="flex items-center border rounded-lg p-2">
                <Tag className="text-gray-500 mr-2" size={20} />
                <input
                  type="text"
                  name="description"
                  placeholder="Item description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div className="flex items-center border rounded-lg p-2">
                <Upload className="text-gray-500 mr-2" size={20} />
                <input
                  type="text"
                  name="category"
                  placeholder="Category (e.g., Electronics, Clothing)"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>

              {/* Location */}
              <div className="flex items-center border rounded-lg p-2">
                <MapPin className="text-gray-500 mr-2" size={20} />
                <input
                  type="text"
                  name="location_description"
                  placeholder="Where did you find it?"
                  value={formData.location_description}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>

              {/* Date */}
              <div className="flex items-center border rounded-lg p-2">
                <Calendar className="text-gray-500 mr-2" size={20} />
                <input
                  type="datetime-local"
                  name="date_time_found"
                  value={formData.date_time_found}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>

              {/* Image URL */}
                <div className="flex items-center border rounded-lg p-2">
                <Camera className="text-gray-500 mr-2" size={20} />
                <input
                    type="url"
                    name="image_url"
                    placeholder="Paste image link (e.g. from Cloudinary)"
                    value={formData.image_url || ""}
                    onChange={handleChange}
                    className="w-full outline-none"
                />
                </div>


              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#01096D] text-white py-2 rounded-lg font-bold hover:bg-[#020B99] transition"
              >
                Submit Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFound;
