import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
      setTokenValid(false);
      return;
    }

    // Redirect if already logged in
    const sessionToken = localStorage.getItem("sessionToken");
    const user = localStorage.getItem("user");
    if (sessionToken && user) {
      navigate("/home");
    }

    setTokenValid(true);
  }, [navigate, token]);

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
    setMessage("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`${API_BASE}/api/forgot-password`, {
        token,
        newPassword: password,
      });

      setMessage(
        "Password has been reset successfully! You can now log in with your new password."
      );
      setIsSuccess(true);

      toast.success("Password successfully reset! Redirecting to login...", {
        position: "top-center",
        autoClose: 4000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMessage);

      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid")
      ) {
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleRequestNewReset = () => {
    navigate("/forgot-password");
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] px-4">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#1a237e] mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={handleRequestNewReset}
            className="w-full py-3 mb-3 bg-gradient-to-r from-[#3949ab] to-[#1a237e] hover:from-[#283593] hover:to-[#3949ab] text-white font-semibold rounded-xl transition-all duration-300"
          >
            Request New Reset Link
          </button>
          <button
            onClick={handleBackToLogin}
            className="w-full py-3 border-2 border-[#3949ab] text-[#3949ab] font-semibold rounded-xl hover:bg-[#3949ab] hover:text-white transition-all duration-300"
          >
            Back to Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      <ToastContainer />

      {/* Background Shapes */}
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

      {/* Left Side: Title */}
      <div
        className="hidden md:flex flex-col justify-center items-start w-full md:w-1/2 px-6 lg:px-20"
        data-aos="fade-right"
      >
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
          {isSuccess ? "Password Reset Successful!" : "Choose a New Password"}
        </h1>
        <p className="text-base lg:text-xl text-white/90 max-w-lg leading-relaxed">
          {isSuccess
            ? "Your password has been successfully updated. You can now log in with your new password."
            : "Create a strong password that you'll remember. It must be at least 6 characters long."}
        </p>
      </div>

      {/* Right Side: Reset Form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 py-8">
        <div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-5 sm:p-8 border border-white/20"
          data-aos="fade-left"
        >
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
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
                      d="M12 11c0-2.21-1.79-4-4-4S4 8.79 4 11m8 0c0 2.21 1.79 4 4 4s4-1.79 4-4m-8 0v8"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1a237e] mb-2">
                  Reset your password
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#1a237e] mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300"
                    required
                    minLength={6}
                    disabled={loading}
                  />
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
                          {password.length >= 8 ? "✓" : "○"} At least 8
                          characters
                        </li>
                        <li
                          className={
                            /[A-Z]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase
                          letter
                        </li>
                        <li
                          className={
                            /[a-z]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {/[a-z]/.test(password) ? "✓" : "○"} One lowercase
                          letter
                        </li>
                        <li
                          className={
                            /\d/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
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
                          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "○"}{" "}
                          One special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-[#1a237e] mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:border-[#3949ab] focus:bg-white transition-all duration-300"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-green-700 text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <button
                onClick={handleBackToLogin}
                className="w-full py-3 px-6 bg-transparent hover:bg-gray-200 text-[#3949ab] hover:text-[#1a237e] border-2 border-[#3949ab] font-medium rounded-xl transition-all duration-300 mt-4"
              >
                ← Back to Sign in
              </button>
            </>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-[#1a237e] mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                You will be redirected to login shortly.
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#3949ab] to-[#1a237e] hover:from-[#283593] hover:to-[#3949ab] text-white font-semibold rounded-xl transition-all duration-300"
              >
                Go to Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
