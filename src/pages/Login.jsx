import React, { useState } from "react";
import '../index.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation (replace with real auth in production)
    if (username === "admin" && password === "password") {
      setError("");
      alert("Login successful!");
      // Redirect or set auth state here
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-stretch transition-colors"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left Side: Quote */}
      <div className="hidden md:flex flex-col justify-center items-start w-1/2 px-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          Sign up, start finding, <br />spread good vibes.
        </h1>
        <p className="text-lg md:text-xl text-white max-w-lg">
          AI-powered lost and found for School Campuses — connecting communities, reuniting people with what matters.
        </p>
      </div>
      {/* Right Side: Login Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm bg-white/90 dark:bg-[#161b22]/90 border border-gray-200 dark:border-[#30363d] rounded-lg shadow-lg p-8 backdrop-blur">
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
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-[#30363d] rounded bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors"
            >
              Sign in
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't Have an account? <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;