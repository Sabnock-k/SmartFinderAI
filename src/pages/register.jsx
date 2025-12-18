import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../api/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Register() {
  const { user, authChecked } = useAuth({ redirectToLogin: false });
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && user) {
      if (user.is_admin === true) {
        navigate("/admin");
      }
    }
  }, [authChecked, user]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

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

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    setPasswordStrength(validatePassword(pass));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate terms agreement
    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to continue.");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength === "weak" || passwordStrength === "") {
      setError(
        "Password is too weak. Please use at least 8 characters with uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/register`, {
        username,
        full_name: fullName,
        email,
        password,
      });
      toast.success("Successfully registered! Redirecting to login...", {
        position: "top-center",
        autoClose: 5000,
      });
      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-8 left-6 w-24 h-24 sm:w-32 sm:h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-10 w-16 h-16 sm:w-20 sm:h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-16 left-1/4 w-12 h-12 sm:w-16 sm:h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-28 right-1/3 w-16 h-16 sm:w-24 sm:h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Logo */}
      <div
        className="flex flex-col justify-center items-center md:absolute top-3 left-3 cursor-pointer z-10"
        onClick={() => navigate("/")}
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-25 sm:w-28 md:w-32 lg:w-36 h-auto drop-shadow-lg"
        />
      </div>

      {/* Left Side: Quote hidden on mobile */}
      <div
        className="hidden md:flex flex-col justify-center items-start w-full md:w-1/2 px-8 lg:px-20"
        data-aos="flip-left"
      >
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Join CampusFind, <br />
          connect and help your community.
        </h1>
        <p className="text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed">
          Register to start finding and claiming lost items, and earn rewards
          for helping others!
        </p>
        <div className="mt-6 flex items-center space-x-4">
          <div className="w-12 h-1 bg-white/60 rounded-full"></div>
          <div className="w-8 h-1 bg-white/40 rounded-full"></div>
          <div className="w-6 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-5 sm:p-8 border border-white/20"
          data-aos="zoom-in-up"
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-1">
              Create your CampusFind account
            </h2>
            <p className="text-gray-600 text-sm">
              Sign up to start helping your campus community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[#1a237e] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300"
                required
                disabled={loading}
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-[#1a237e] mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1a237e] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#1a237e] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300 pr-12"
                  required
                  disabled={loading}
                  pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}'
                  title="Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3949ab] transition-colors duration-200 text-lg"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {password && (
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
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {password.length >= 8 ? "✓" : "○"} At least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[a-z]/.test(password) ? "✓" : "○"} One lowercase letter
                    </li>
                    <li
                      className={
                        /\d/.test(password) ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {/\d/.test(password) ? "✓" : "○"} One number
                    </li>
                    <li
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "○"} One
                      special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-[#1a237e] mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300 pr-12"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3949ab] transition-colors duration-200 text-lg"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Register
                </>
              )}
            </button>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 cursor-pointer accent-[#3949ab]"
                disabled={loading}
              />
              <p className="text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#3949ab] underline hover:text-[#1a237e]"
                >
                  Terms and Conditions
                </button>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">
                  Already have an account?
                </span>
              </div>
            </div>
            <div className="mt-4">
              <a
                href="/login"
                className="inline-flex items-center px-6 py-2 border-2 border-[#3949ab] text-[#3949ab] hover:bg-[#3949ab] hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-[#1a237e] mb-4">
              Terms and Conditions
            </h2>

            <div className="text-[#1a237e] text-sm max-h-72 overflow-y-auto pr-2 space-y-4 leading-relaxed">
              <section>
                <p className="font-semibold text-base text-[#283593]">
                  Welcome to CAMPUSFIND
                </p>
                <p className="text-gray-700">
                  CAMPUSFIND is a digital lost-and-found platform designed to
                  help the campus community report, search, and recover lost
                  items. By accessing or using CAMPUSFIND, you agree to comply
                  with and be bound by the following Terms and Conditions. If
                  you do not agree, please discontinue use of the platform.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  1. Purpose of the Platform
                </h3>
                <p className="text-gray-700">
                  CAMPUSFIND is intended solely for use within the campus
                  community to facilitate reporting, tracking, and claiming of
                  lost and found items. The platform serves as an information
                  system only and does not guarantee recovery of items.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  2. User Eligibility and Responsibilities
                </h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>
                    Users must be students, faculty, staff, or authorized
                    personnel.
                  </li>
                  <li>Information must be accurate and truthful.</li>
                  <li>No false or fraudulent reports are allowed.</li>
                  <li>Users must secure their account credentials.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  3. Reporting Lost and Found Items
                </h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Descriptions must be complete and accurate.</li>
                  <li>Images must be appropriate and relevant.</li>
                  <li>Admins may remove or edit reports that violate rules.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  4. Claiming of Items
                </h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Proof of ownership may be required.</li>
                  <li>Unverifiable claims may be denied.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  5. Unclaimed Items Policy (Time-Based Ownership Status)
                </h3>

                <h4 className="font-medium text-[#3949ab] mt-2">
                  5.1 Claim Period
                </h4>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>
                    Each item is subject to a Claim Period based on admin
                    settings.
                  </li>
                  <li>
                    Claim Period begins once item is logged in the system.
                  </li>
                </ul>

                <h4 className="font-medium text-[#3949ab] mt-2">
                  5.2 Status During Claim Period
                </h4>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Items remain marked as “Unclaimed.”</li>
                  <li>Notifications remain active.</li>
                </ul>

                <h4 className="font-medium text-[#3949ab] mt-2">
                  5.3 Expiration of Claim Period
                </h4>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>
                    Items automatically transition to “No Owner / Unclaimed
                    Beyond Claim Period.”
                  </li>
                  <li>Number of days depends on admin policy.</li>
                </ul>

                <h4 className="font-medium text-[#3949ab] mt-2">
                  5.4 Disposal Procedure
                </h4>
                <p className="text-gray-700">
                  If the item remains unclaimed, it may be:
                </p>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Retained for institutional use</li>
                  <li>Donated</li>
                  <li>Responsibly disposed</li>
                  <li>Transferred based on regulations</li>
                </ul>
                <p className="text-gray-700">
                  CAMPUSFIND is not responsible for handling beyond Claim
                  Period.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  6. Administrative Rights
                </h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Modify claimable days</li>
                  <li>Approve/deny claims</li>
                  <li>Remove inappropriate content</li>
                  <li>Suspend or ban users for abuse</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  7. Limitation of Liability
                </h3>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Platform is provided “as-is.”</li>
                  <li>Not liable for lost, damaged, or misused items.</li>
                  <li>Not responsible for disputes.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  8. Modifications to Terms
                </h3>
                <p className="text-gray-700">
                  CAMPUSFIND may modify these Terms anytime. Continued use
                  signifies acceptance of changes.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base text-[#283593]">
                  9. Contact & Support
                </h3>
                <p className="text-gray-700">
                  For help or disputes, contact the campus Lost and Found Office
                  or system administrator.
                </p>
              </section>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
