import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../index.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    setFadeIn(true);
    
    // Check if token exists
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
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

  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.put(`${API_BASE}/api/reset-password`, {
        token,
        newPassword: password
      });

      setMessage("Password has been reset successfully! You can now log in with your new password.");
      setIsSuccess(true);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMessage);
      
      // If token is expired or invalid, offer to request new reset
      if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
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

  // Show error page if no token
  if (tokenValid === false) {
    return (
      <div
        className="min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: "url('/background.png')",
        }}
      >
        <div className="w-full max-w-sm bg-[#161b22]/90 border border-[#30363d] rounded-lg shadow-lg p-8 backdrop-blur">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Invalid Reset Link</h2>
            <p className="text-gray-300 text-sm mb-6">{error}</p>
            <button
              onClick={handleRequestNewReset}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors mb-4"
            >
              Request New Reset Link
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full py-2 px-4 bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white border border-[#30363d] font-medium rounded transition-colors"
            >
              Back to Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover flex items-stretch"
      style={{
        backgroundImage: "url('/background.png')",
      }}
    >
      {/* Left Side: Quote */}
      <div className="hidden md:flex flex-col justify-center items-start w-1/2 px-16" style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateX(0px)" : "translateX(40px)",
            transition: "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)"
          }}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 mb-6 leading-tight">
          {isSuccess ? "Password Reset!" : "Choose a new password"}
        </h1>
        <p className="text-lg md:text-xl text-white max-w-lg">
          {isSuccess 
            ? "Your password has been successfully updated. You can now sign in with your new password." 
            : "Create a strong password that you'll remember. Make sure it's at least 6 characters long."
          }
        </p>
      </div>
      
      {/* Right Side: Reset Password Form */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="w-full max-w-sm bg-[#161b22]/90 border border-[#30363d] rounded-lg shadow-lg p-8 backdrop-blur"
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0px)" : "translateY(40px)",
            transition: "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)"
          }}
        >
          {!isSuccess ? (
            <>
              <h2 className="text-center text-2xl font-bold mb-6 text-gray-100">
                Reset your password
              </h2>
              
              <p className="text-center text-sm text-gray-300 mb-6">
                Enter your new password below.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[#30363d] rounded bg-[#0d1117] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-[#30363d] rounded bg-[#0d1117] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                
                {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
                {message && <div className="text-green-400 text-sm mb-4">{message}</div>}
                
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors flex items-center justify-center mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style={{ marginRight: "8px" }}>
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
                                repeatCount="indefinite" />
                            </path>
                          </g>
                        </g>
                      </svg>
                      Resetting password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <svg className="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Password Reset Successful!</h2>
              
              <p className="text-gray-300 text-sm mb-6">
                Your password has been successfully updated. You will be redirected to the login page in a few seconds.
              </p>
              
              <button
                onClick={handleBackToLogin}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors"
              >
                Go to Sign in
              </button>
            </div>
          )}
          
          {!isSuccess && (
            <button
              onClick={handleBackToLogin}
              className="w-full py-2 px-4 bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white border border-[#30363d] font-medium rounded transition-colors"
              disabled={loading}
            >
              ← Back to Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;