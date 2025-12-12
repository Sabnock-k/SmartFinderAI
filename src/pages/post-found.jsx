import { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import useAuth from "../../api/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Camera,
  MapPin,
  Calendar,
  Tag,
  Loader,
  ImagePlus,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { supabase } from "../../api/utils/supabaseClient.js";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PostFound = () => {
  const { user, authChecked } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // New state for the image file

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

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location_description: "",
    date_time_found: "",
    image_url: "",
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Accessories",
    "Books",
    "Keys",
    "Bags",
    "Documents",
    "Jewelry",
    "Sports Equipment",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
    // Do not upload yet, just preview and store file
  };

  // Maximum allowed lengths
  const MAX_DESCRIPTION_LENGTH = 200;
  const MAX_LOCATION_LENGTH = 100;

  // Validation function
  const validateFormLengths = (data) => {
    if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(
        `Description is too long. Maximum is ${MAX_DESCRIPTION_LENGTH} characters.`,
        { position: "top-center", autoClose: 3000 }
      );
      return false;
    }

    if (data.location_description.length > MAX_LOCATION_LENGTH) {
      toast.error(
        `Location description is too long. Maximum is ${MAX_LOCATION_LENGTH} characters.`,
        { position: "top-center", autoClose: 3000 }
      );
      return false;
    }

    return true; // all good
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate description & location lengths
    if (!validateFormLengths(formData)) {
      return; // Stop submission if invalid
    }

    setIsLoading(true);

    let imageUrl = formData.image_url;

    // If user selected a file, upload it to Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;
      const filePath = `found-items/${fileName}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        });

      if (error) {
        toast.error("Image upload failed.");
        setIsLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/found-item`, {
        reported_by_user_id: user.user_id,
        description: formData.description,
        category: formData.category,
        location_description: formData.location_description,
        date_time_found: formData.date_time_found,
        image_url: imageUrl,
      });

      const backendMessage = res.data.message || "Item uploaded";

      toast.success(backendMessage, {
        position: "top-center",
        autoClose: 3000,
      });

      setFormData({
        description: "",
        category: "",
        location_description: "",
        date_time_found: "",
        image_url: "",
      });
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      // Display the specific error message from backend
      const errorMessage =
        err.response?.data?.error ||
        "Error uploading found item. Please try again.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="z-20">
        <Navbar user={user} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-15 sm:px-6 sm:-translate-y-[50px] z-10 w-full">
        {/* Header */}
        <div className="w-full max-w-3xl text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Report Found Item
          </h2>
          <p className="text-white text-sm md:text-base">
            Upload lost items. Help reunite owners with their belongings.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image Upload Card */}
          <div
            className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 flex flex-col items-center"
            data-aos="fade-up"
          >
            <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
              <Camera className="w-4 h-4" />
              Upload Image
            </label>
            <label className="flex flex-col items-center justify-center gap-2 cursor-pointer px-6 py-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-100 transition w-full min-h-[140px] mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-blue-200"
                />
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 text-blue-400" />
                  <span className="text-blue-700 font-medium">
                    Choose Image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Or paste image URL here"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
              disabled={isLoading}
            />

            {/* Profile Reminder */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                💡 <span className="font-semibold">Reminder:</span> Please
                configure your profile first to set up your Facebook link for
                easier communication.
              </p>
            </div>

            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                💡 <span className="font-semibold">Reminder:</span> Please pick
                a clear image of the found item to help identify it
              </p>
            </div>
          </div>

          {/* Right: Inputs Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 flex flex-col justify-between"
            data-aos="fade-up"
          >
            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item you found..."
                className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-blue-50"
                rows="3"
                required
              />
            </div>
            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-900 mb-1 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
                required
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
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-900 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Location Found *
              </label>
              <input
                type="text"
                name="location_description"
                value={formData.location_description}
                onChange={handleChange}
                placeholder="e.g., Library 2nd floor, near the entrance"
                className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
                required
              />
            </div>
            {/* Date and Time Found */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-900 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date & Time Found *
              </label>
              <input
                type="datetime-local"
                name="date_time_found"
                value={formData.date_time_found}
                onChange={handleChange}
                className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50"
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg"
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
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default PostFound;
