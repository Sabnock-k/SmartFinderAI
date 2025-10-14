import axios from "axios";
import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../index.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("sessionToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(`${API_BASE}/api/forgot-password`, { email });
      setMessage(
        "If an account with that email exists, we've sent you a password reset link."
      );
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleResendEmail = async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/api/forgot-password`, { email });
      setMessage("Reset link sent again. Please check your email.");
    } catch (err) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 sm:top-40 right-10 sm:right-20 w-16 sm:w-20 h-16 sm:h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-16 sm:bottom-20 left-1/4 w-12 sm:w-16 h-12 sm:h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-32 sm:bottom-40 right-1/3 w-20 sm:w-24 h-20 sm:h-24 border-2 border-white rounded-lg rotate-12"></div>
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

      {/* Left Side: Quote */}
      <div
        className="hidden md:flex flex-col justify-center items-start w-full md:w-1/2 px-6 lg:px-20"
        data-aos="fade-left"
      >
        <h1 className="text-2xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
          Lost your password? <br /> We've got you covered.
        </h1>
        <p className="text-base lg:text-xl text-white/90 max-w-lg leading-relaxed">
          Enter your email address and we'll send you a secure link to reset
          your password and get back to finding lost items.
        </p>
        <div className="mt-6 flex items-center space-x-4">
          <div className="w-10 lg:w-12 h-1 bg-white/60 rounded-full"></div>
          <div className="w-6 lg:w-8 h-1 bg-white/40 rounded-full"></div>
          <div className="w-4 lg:w-6 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Right Side: Forgot Password Form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 py-8">
        <div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-5 sm:p-8 border border-white/20"
          data-aos="fade-right"
        >
          <div className="text-center mb-3">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#1a237e] to-[#3949ab] rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1a237e] mb-2">
              {isSubmitted ? "Check your email" : "Forgot your password?"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isSubmitted
                ? "We've sent a password reset link to your email."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          <div className="space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-sm font-semibold text-[#1a237e] mb-2"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300"
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm mt-4">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-green-700 text-sm mt-4">
                    {message}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        width="22"
                        height="22"
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
                      Sending reset link...
                    </span>
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
                          d="M16 12v4m0 0v4m0-4h4m-4 0h-4m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Send reset link
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-12 w-12 text-green-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm mb-6">
                  We've sent a password reset link to{" "}
                  <strong className="text-[#1a237e]">{email}</strong>
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm mb-4">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-green-700 text-sm mb-4">
                    {message}
                  </div>
                )}
                <button
                  onClick={handleResendEmail}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#3949ab] to-[#1a237e] hover:from-[#283593] hover:to-[#3949ab] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        width="22"
                        height="22"
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
                      Resending...
                    </span>
                  ) : (
                    "Resend email"
                  )}
                </button>
              </div>
            )}
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 px-6 bg-transparent hover:bg-gray-200 text-[#3949ab] hover:text-[#1a237e] border-2 border-[#3949ab] font-medium rounded-xl transition-all duration-300 mt-2"
              disabled={loading}
            >
              ← Back to Sign in
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">
                  Remember your password?
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
    </div>
  );
}

export default ForgotPassword;
