import { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Lock,
  Bell,
  LogOut,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser); // Set formData when user is loaded
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Update local state and localStorage
    const updatedUser = {
      ...user,
      username: formData.username,
      full_name: formData.full_name,
      email: formData.email,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    try {
      await axios.post(`${API_BASE}/api/update-profile`, {
        user_id: user.user_id,
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
      });
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity({ ...security, [name]: value });
  };

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error("Passwords don't match!", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    if (security.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/update-password`, {
        user_id: user.user_id,
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      toast.success("Password changed successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update password", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    navigate("/login");
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-lg font-medium">
            Please login to view your profile.
          </p>
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
      <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden md:sticky md:top-20">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "security", label: "Security", icon: Lock },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-white/10 transition ${
                    activeTab === id
                      ? "bg-blue-600 text-white"
                      : "text-blue-100 hover:bg-white/5"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 transition"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <ToastContainer />
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl sm:text-5xl shadow-lg">
                      {user?.avatar || user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {user?.full_name}
                      </h2>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData?.username || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData?.full_name || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData?.email || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Your Notifications
                </h2>
                <p className="text-blue-100">No notifications yet.</p>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Security Settings
                </h2>

                {/* Change Password */}
                <div className="mb-8 pb-8 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={security.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={security.newPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                          placeholder="Enter new password"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-blue-300 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={security.confirmPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                          placeholder="Confirm new password"
                        />
                        <button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2.5 text-blue-300 hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <ClipLoader size={20} color="#fff" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>Change Password</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
