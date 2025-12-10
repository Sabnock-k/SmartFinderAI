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
  const { user, authChecked } = useAuth();
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
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && user) {
      if (user.is_admin === true) {
        navigate("/admin");
      }

      navigate("/home");
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
    </div>
  );
}

export default Register;
