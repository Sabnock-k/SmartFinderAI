import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    studentId: "STU2024001",
    major: "Computer Science",
    campus: "Main Campus",
    bio: "Always looking for lost items or helping others find theirs!",
    avatar: "👤",
  });

  const [formData, setFormData] = useState(profile);

  const [notifications, setNotifications] = useState({
    itemFound: true,
    itemMatched: true,
    itemRecovered: true,
    communityUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = () => {
    setProfile(formData);
    setIsEditing(false);
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    setSaveMessage("Notification preferences updated!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity({ ...security, [name]: value });
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      setSaveMessage("Passwords don't match!");
      return;
    }
    setSaveMessage("Password changed successfully!");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-blue-200 text-sm">
            Manage your profile and preferences
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden sticky top-20">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "security", label: "Security", icon: Lock },
                { id: "privacy", label: "Privacy & Safety", icon: Shield },
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
              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 transition">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Save Message */}
            {saveMessage && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
                {saveMessage}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-5xl shadow-lg">
                      {profile.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className="text-blue-200 text-sm">{profile.major}</p>
                      <p className="text-blue-300 text-xs mt-1">
                        ID: {profile.studentId}
                      </p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
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
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={
                          isEditing ? formData.firstName : profile.firstName
                        }
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={isEditing ? formData.lastName : profile.lastName}
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
                        value={isEditing ? formData.email : profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={isEditing ? formData.phone : profile.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Major
                      </label>
                      <input
                        type="text"
                        name="major"
                        value={isEditing ? formData.major : profile.major}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">
                        Campus
                      </label>
                      <input
                        type="text"
                        name="campus"
                        value={isEditing ? formData.campus : profile.campus}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={isEditing ? formData.bio : profile.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition resize-none"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
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
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "itemFound",
                      label: "Item Found Alerts",
                      description:
                        "Get notified when items matching your lost items are found",
                    },
                    {
                      key: "itemMatched",
                      label: "AI Match Notifications",
                      description:
                        "Receive alerts when AI finds potential matches",
                    },
                    {
                      key: "itemRecovered",
                      label: "Item Recovery Updates",
                      description: "Updates on the status of your lost items",
                    },
                    {
                      key: "communityUpdates",
                      label: "Community Updates",
                      description:
                        "Receive news and updates from the CampusFinder community",
                    },
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive notifications via email",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS Notifications",
                      description: "Receive notifications via text message",
                    },
                  ].map(({ key, label, description }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      <div>
                        <p className="text-white font-medium">{label}</p>
                        <p className="text-blue-200 text-sm">{description}</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`relative w-14 h-8 rounded-full transition ${
                          notifications[key] ? "bg-green-600" : "bg-gray-600"
                        }`}
                      >
                        <div
                          className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                            notifications[key]
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
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
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Enable 2FA</p>
                      <p className="text-blue-200 text-sm">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSecurity({
                          ...security,
                          twoFactorEnabled: !security.twoFactorEnabled,
                        })
                      }
                      className={`relative w-14 h-8 rounded-full transition ${
                        security.twoFactorEnabled
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                          security.twoFactorEnabled
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Safety Tab */}
            {activeTab === "privacy" && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Privacy & Safety
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "Public Profile",
                      description: "Allow other users to view your profile",
                    },
                    {
                      label: "Show Online Status",
                      description: "Let others see when you're online",
                    },
                    {
                      label: "Allow Direct Messages",
                      description: "Permit other users to send you messages",
                    },
                    {
                      label: "Show Activity History",
                      description:
                        "Display your recent activity on the platform",
                    },
                    {
                      label: "Data Usage Tracking",
                      description:
                        "Help improve CampusFinder by sharing usage data",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-blue-200 text-sm">
                          {item.description}
                        </p>
                      </div>
                      <button className="relative w-14 h-8 rounded-full bg-green-600">
                        <div className="absolute w-6 h-6 bg-white rounded-full top-1 translate-x-7" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Danger Zone */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-bold text-red-400 mb-4">
                    Danger Zone
                  </h3>
                  <button className="px-6 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-600/30 transition">
                    Delete Account
                  </button>
                  <p className="text-red-300/70 text-sm mt-2">
                    This action cannot be undone. Please proceed with caution.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;
