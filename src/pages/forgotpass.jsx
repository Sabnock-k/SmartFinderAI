import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Change port if needed

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
    // Redirect if already logged in
    const token = localStorage.getItem("sessionToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE}/api/recover`, {
        email
      });

      setMessage("If an account with that email exists, we've sent you a password reset link.");
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
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
      await axios.post(`${API_BASE}/api/recover`, {
        email
      });
      setMessage("Reset link sent again. Please check your email.");
    } catch (err) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          Lost your password? <br />We've got you covered.
        </h1>
        <p className="text-lg md:text-xl text-white max-w-lg">
          Enter your email address and we'll send you a secure link to reset your password and get back to finding lost items.
        </p>
      </div>
      
      {/* Right Side: Forgot Password Form */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="w-full max-w-sm bg-[#161b22]/90 border border-[#30363d] rounded-lg shadow-lg p-8 backdrop-blur"
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0px)" : "translateY(40px)",
            transition: "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <h2 className="text-center text-2xl font-bold mb-6 text-gray-100">
            {isSubmitted ? "Check your email" : "Forgot your password?"}
          </h2>
          
          {!isSubmitted ? (
            <>
              <p className="text-center text-sm text-gray-300 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[#30363d] rounded bg-[#0d1117] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    autoComplete="email"
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
                      Sending reset link...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <svg className="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <p className="text-gray-300 text-sm mb-6">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              
              <p className="text-gray-400 text-xs mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
              {message && <div className="text-green-400 text-sm mb-4">{message}</div>}
              
              <button
                onClick={handleResendEmail}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors flex items-center justify-center mb-4"
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
            className="w-full py-2 px-4 bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white border border-[#30363d] font-medium rounded transition-colors"
            disabled={loading}
          >
            ← Back to Sign in
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            Remember your password? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;