// claim-item.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ClaimItem = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("sessionToken");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      setLoggedIn(true);
    }
  }, []);

  const handleSearch = async () => {
	if (!query.trim()) return;

	setLoading(true);
	try {
		const res = await fetch(`${API_BASE}/api/ai-search`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ query }),
		});

		// Check if response is JSON before parsing
		const text = await res.text();
		let data = {};
		try {
		data = JSON.parse(text);
		} catch (parseErr) {
		console.error("Invalid JSON response:", text);
		throw new Error("Server did not return valid JSON");
		}

		if (data.items) {
		setResults(data.items);
		} else {
		setResults([]);
		}
	} catch (err) {
		console.error("Search failed:", err);
	} finally {
		setLoading(false);
	}
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-lg font-medium">Please login to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: "url('/background.png')",
      }}
    >
      <div className="min-h-screen bg-black/20 backdrop-blur-sm flex flex-col">
        <Navbar user={user} />

        <div className="flex flex-col items-center justify-start pt-[8vh] px-4">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-6">
            Claim Lost & Found Items
          </h1>

          {/* Search Box */}
          <div className="flex w-full max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your lost item..."
              className="flex-grow px-4 py-2 rounded-l-lg border border-white bg-transparent text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-r-lg bg-white text-[#01096D] font-extrabold shadow-md hover:bg-[#dbeafe] transition"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Results */}
          <div className="mt-8 w-full max-w-3xl">
            {results.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((item) => (
                  <li
                    key={item.found_item_id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.description}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                    )}
                    <h2 className="font-bold text-lg">{item.category}</h2>
                    <p className="text-gray-700">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Location: {item.location_description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Found: {new Date(item.date_time_found).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Similarity: {(item.similarity * 100).toFixed(2)}%
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && (
                <p className="text-center text-white text-lg mt-6">
                  No items found. Try another search.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimItem;
