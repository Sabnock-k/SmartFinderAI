import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import useAuth from "../../../api/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SettingsPage = () => {
  const { user, authChecked } = useAuth();
  const navigate = useNavigate();

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // System settings state
  const [autoApprove, setAutoApprove] = useState(false);
  const [expirationDays, setExpirationDays] = useState(30);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (authChecked && user) {
      if (!user.is_admin) navigate("/home");
    }
  }, [authChecked, user]);

  // Fetch system settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/settings/settings`);
        setAutoApprove(res.data.auto_approve);
        setExpirationDays(res.data.expiration_days);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Password validation function
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

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Validate new password strength
    if (name === "newPassword") {
      setPasswordStrength(validatePassword(value));
    }

    setPasswordError("");
    setPasswordSuccess("");
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    // Validate password strength
    if (passwordStrength === "weak" || passwordStrength === "") {
      setPasswordError(
        "Password is too weak. Please use at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/admin/settings/update-password`,
        {
          userId: user.user_id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );

      setPasswordSuccess(
        response.data.message || "Password changed successfully!"
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength("");
    } catch (error) {
      if (error.response) {
        setPasswordError(
          error.response.data.error || "Failed to change password"
        );
      } else if (error.request) {
        setPasswordError("No response from server. Please try again.");
      } else {
        setPasswordError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle system settings save
  const handleSettingsSave = async () => {
    setSettingsError("");
    setSettingsSuccess("");
    setIsSavingSettings(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/settings/update-settings`,
        {
          auto_approve: autoApprove,
          expiration_days: expirationDays,
        }
      );
      setSettingsSuccess(res.data.message || "Settings updated successfully!");
    } catch (err) {
      setSettingsError("Failed to save settings.");
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      <AdminNav />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-white text-3xl font-bold mb-6">System Settings</h2>

        {/* Password Change */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-lg"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                  placeholder="Enter new password"
                  pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}'
                  title="Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-lg"
                  tabIndex={-1}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
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
                        ? "text-red-600"
                        : passwordStrength === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength === "weak" && "Weak password"}
                    {passwordStrength === "medium" && "Medium strength"}
                    {passwordStrength === "strong" && "Strong password"}
                  </p>
                  <ul className="mt-2 text-xs space-y-1">
                    <li
                      className={
                        passwordData.newPassword.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {passwordData.newPassword.length >= 8 ? "✓" : "○"} At
                      least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[A-Z]/.test(passwordData.newPassword) ? "✓" : "○"} One
                      uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[a-z]/.test(passwordData.newPassword) ? "✓" : "○"} One
                      lowercase letter
                    </li>
                    <li
                      className={
                        /\d/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/\d/.test(passwordData.newPassword) ? "✓" : "○"} One
                      number
                    </li>
                    <li
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)
                        ? "✓"
                        : "○"}{" "}
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-lg"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            System Settings
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Auto-Approve Items
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              value={autoApprove ? "auto" : "manual"}
              onChange={(e) => setAutoApprove(e.target.value === "auto")}
            >
              <option value="manual">Require manual approval</option>
              <option value="auto">Auto-approve all</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Expiration (days)
            </label>
            <input
              type="number"
              value={expirationDays}
              onChange={(e) => setExpirationDays(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {settingsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {settingsError}
            </div>
          )}
          {settingsSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {settingsSuccess}
            </div>
          )}

          <button
            onClick={handleSettingsSave}
            disabled={isSavingSettings}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSavingSettings ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
