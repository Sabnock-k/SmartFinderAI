import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
    // Auto-login if session token exists
    const token = localStorage.getItem("sessionToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/login", {
        username,
        password
      });

      setError("");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("sessionToken", res.data.sessionToken);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          Sign up, start finding, <br />spread good vibes.
        </h1>
        <p className="text-lg md:text-xl text-white max-w-lg">
          AI-powered lost and found for School Campuses — connecting communities, reuniting people with what matters.
        </p>
      </div>
      {/* Right Side: Login Form */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="w-full max-w-sm bg-white/90 dark:bg-[#161b22]/90 border border-gray-200 dark:border-[#30363d] rounded-lg shadow-lg p-8 backdrop-blur"
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0px)" : "translateY(40px)",
            transition: "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <h2 className="text-center text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Sign in to CampusFind</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
                Username or email address
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-[#30363d] rounded bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-[#30363d] rounded bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#2563eb",
                    fontSize: "1.1rem",
                    padding: 0
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors flex items-center justify-center"
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
                  Logging in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't Have an account? <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;