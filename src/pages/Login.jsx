import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/login`, {
        username,
        password,
      });
      setError("");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-10 w-14 h-14 sm:w-20 sm:h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-16 left-1/4 w-12 h-12 sm:w-16 sm:h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-28 right-1/3 w-16 h-16 sm:w-24 sm:h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Logo */}
      <div
        className="flex justify-center md:absolute top-3 left-3 cursor-pointer z-10"
        onClick={() => navigate("/")}
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-25 sm:w-28 md:w-32 lg:w-36 h-auto drop-shadow-lg"
        />
      </div>

      {/* Left Side (Hidden on mobile) */}
      <div
        className="hidden md:flex flex-col justify-center items-start w-full md:w-1/2 px-8 lg:px-20"
        data-aos="flip-left"
      >
        <h1 className="text-2xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Sign up, start finding, <br /> spread good vibes.
        </h1>
        <p className="text-base lg:text-xl text-white/90 max-w-lg leading-relaxed">
          AI-powered lost and found for School Campuses — connecting
          communities, reuniting people with what matters.
        </p>
        <div className="mt-6 flex items-center space-x-4">
          <div className="w-12 h-1 bg-white/60 rounded-full"></div>
          <div className="w-8 h-1 bg-white/40 rounded-full"></div>
          <div className="w-6 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-5 sm:p-8 border border-white/20"
          data-aos="zoom-in-up"
        >
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-[#1a237e] to-[#3949ab] rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a237e] mb-1">
              Sign in to CampusFind
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-sm font-semibold text-[#1a237e] mb-2"
                htmlFor="username"
              >
                Username or email address
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300 text-sm sm:text-base"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="block text-sm font-semibold text-[#1a237e]"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-[#3949ab] hover:text-[#1a237e] font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300 pr-10 text-sm sm:text-base"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3949ab] text-base"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-2 sm:p-3 rounded text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 38 38"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#fff"
                    className="mr-2"
                  >
                    <g fill="none" fillRule="evenodd">
                      <g transform="translate(1 1)" strokeWidth="3">
                        <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.8s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </g>
                    </g>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <>
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
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 sm:px-4 bg-white text-gray-600">
                  New to CampusFind?
                </span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <a
                href="/register"
                className="inline-flex items-center px-4 sm:px-6 py-2 border-2 border-[#3949ab] text-[#3949ab] hover:bg-[#3949ab] hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base"
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
