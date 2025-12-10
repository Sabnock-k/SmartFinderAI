import { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import useAuth from "../../api/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, LogOut, Edit2, Save, X, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const { user, authChecked } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  // Initialize with empty strings instead of empty object
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    facebook_account_link: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && user) {
      if (user.is_admin === true) {
        navigate("/admin");
      }
    }
  }, [authChecked, user]);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        full_name: user.full_name || "",
        email: user.email || "",
        facebook_account_link: user.facebook_account_link || "",
      });
    }
  }, [user]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/update-profile`, {
        user_id: user.user_id,
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        facebook_account_link: formData.facebook_account_link,
      });

      // Update the token with new user data
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
      });

      setIsEditing(false);

      // Reload page to refresh JWT token with updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.error, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    if (
      isLongEnough &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    ) {
      return "strong";
    } else if (
      isLongEnough &&
      ((hasUpperCase && hasLowerCase && hasNumber) ||
        (hasUpperCase && hasLowerCase && hasSpecialChar))
    ) {
      return "medium";
    } else if (pass.length >= 6) {
      return "weak";
    }
    return "";
  };

  const handlePasswordChange = async (e) => {
    const pass = e.target.value;
    setNewPassword(pass);
    setPasswordStrength(validatePassword(pass));
  };

  const handleNewPassSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    if (passwordStrength === "weak" || passwordStrength === "") {
      toast.error(
        "Password is too weak. Please use at least 8 characters with uppercase, lowercase, number, and special character.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/update-password`, {
        user_id: user.user_id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      toast.success("Password changed successfully!", {
        position: "top-center",
        autoClose: 5000,
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength("");
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
    setFormData({
      username: user.username || "",
      full_name: user.full_name || "",
      email: user.email || "",
      facebook_account_link: user.facebook_account_link || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
                { id: "security", label: "Security", icon: Lock },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-white/10 transition relative ${
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
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {user?.full_name}
                      </h2>
                      <p className="text-blue-200">@{user?.username}</p>
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
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
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
                        value={formData.full_name}
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
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Facebook Link
                      </label>
                      <input
                        type="url"
                        name="facebook_account_link"
                        placeholder="https://facebook.com/your.profile"
                        value={formData.facebook_account_link}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <ClipLoader size={18} color="#fff" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
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
                  <form onSubmit={handleNewPassSubmit} className="space-y-4">
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        placeholder="Enter current password"
                        required
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
                          value={newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-blue-300 hover:text-white"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>

                        {newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`h-1 flex-1 rounded-full ${
                                  passwordStrength === "weak"
                                    ? "bg-red-500"
                                    : passwordStrength === "medium"
                                    ? "bg-yellow-500"
                                    : passwordStrength === "strong"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <div
                                className={`h-1 flex-1 rounded-full ${
                                  passwordStrength === "medium" ||
                                  passwordStrength === "strong"
                                    ? passwordStrength === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <div
                                className={`h-1 flex-1 rounded-full ${
                                  passwordStrength === "strong"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            </div>
                            <p
                              className={`text-xs ${
                                passwordStrength === "weak"
                                  ? "text-red-400"
                                  : passwordStrength === "medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {passwordStrength === "weak" && "Weak password"}
                              {passwordStrength === "medium" &&
                                "Medium strength"}
                              {passwordStrength === "strong" &&
                                "Strong password"}
                            </p>
                            <ul className="mt-2 text-xs space-y-1 text-blue-200">
                              <li
                                className={
                                  newPassword.length >= 8
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                {newPassword.length >= 8 ? "✓" : "○"} At least 8
                                characters
                              </li>
                              <li
                                className={
                                  /[A-Z]/.test(newPassword)
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                {/[A-Z]/.test(newPassword) ? "✓" : "○"} One
                                uppercase letter
                              </li>
                              <li
                                className={
                                  /[a-z]/.test(newPassword)
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                {/[a-z]/.test(newPassword) ? "✓" : "○"} One
                                lowercase letter
                              </li>
                              <li
                                className={
                                  /\d/.test(newPassword)
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                {/\d/.test(newPassword) ? "✓" : "○"} One number
                              </li>
                              <li
                                className={
                                  /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                                  ? "✓"
                                  : "○"}{" "}
                                One special character
                              </li>
                            </ul>
                          </div>
                        )}
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
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
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
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
                  </form>
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
