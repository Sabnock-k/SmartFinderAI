import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import useAuth from "../../api/hooks/useAuth.js";
import formatDate from "../components/date-format.jsx";
import {
  Search,
  Loader,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
  X,
  ImageOff,
} from "lucide-react";

const SearchPage = () => {
  const { user, authChecked } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedItems, setClaimedItems] = useState(new Set());

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (authChecked && user) {
      if (user.is_admin === true) {
        navigate("/admin");
      }
    }
  }, [authChecked, user]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter a search query", "warning");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await axios.post(`${API_BASE}/api/search-items`, {
        query: searchQuery,
        userId: user?.user_id,
      });

      const data = response.data;
      setSearchResults(data.results || []);

      if (!data.results || data.results.length === 0) {
        showToast("No matching items found. Try different keywords!", "info");
      }
    } catch (err) {
      console.error("Search error:", err);
      showToast("Error searching items. Please try again.", "error");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClaimItem = async (item) => {
    if (!user) {
      showToast("Please log in to claim items", "warning");
      return;
    }

    // Check if already claimed by this user
    if (claimedItems.has(item.item_id)) {
      showToast("You have already claimed this item", "warning");
      return;
    }

    setIsClaiming(true);
    try {
      const response = await axios.post(`${API_BASE}/api/claim-item`, {
        found_item_id: item.item_id,
        requested_by_user_id: user.user_id,
      });

      // Get founder details
      const founderResponse = await axios.get(
        `${API_BASE}/api/founder-info/${item.reported_by_user_id}`
      );

      const founder = founderResponse.data;

      showToast("Claim attempt submitted! Founder notified.", "success");

      // Mark item as claimed
      setClaimedItems((prev) => new Set(prev).add(item.item_id));

      // Update search results
      setSearchResults((prevResults) =>
        prevResults.map((resultItem) =>
          resultItem.item_id === item.item_id
            ? {
                ...resultItem,
                status: "attempting to claim",
                claimer_name: user.full_name,
                founder_name: founder.full_name,
                founder_email: founder.email,
                founder_facebook: founder.facebook_account_link,
              }
            : resultItem
        )
      );

      // Update selected item with founder details
      setSelectedItem({
        ...item,
        status: "attempting to claim",
        claimer_name: user.full_name,
        founder_name: founder.full_name,
        founder_email: founder.email,
        founder_facebook: founder.facebook_account_link,
      });
    } catch (err) {
      console.error("Error claiming item:", err);
      showToast("Failed to claim item. Please try again.", "error");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const isItemClaimed = (item) => {
    return (
      claimedItems.has(item.item_id) ||
      item.claimer_name ||
      item.status === "attempting to claim"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : toast.type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <Navbar user={user} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center px-4 sm:px-6 py-8 z-10 w-full">
        {/* Header */}
        <div className="w-full max-w-4xl text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Search Lost Items
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4">
            AI-powered search to help you find your lost belongings
          </p>

          {/* Extra note about NLP */}
          <p className="text-white/80 text-xs md:text-sm mb-4 italic">
            This uses NLP (Natural Language Processing). Just talk casually to
            our AI and find your item.
          </p>

          {/* Search Tips */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-left">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Search Tips for Best Results
            </h3>
            <ul className="text-white/90 text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 mt-0.5">•</span>
                <span>
                  Be specific about the item:{" "}
                  <span className="text-yellow-200 font-medium">
                    "I lost my blue Nike backpack"
                  </span>{" "}
                  instead of just "backpack"
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 mt-0.5">•</span>
                <span>
                  Include location details:{" "}
                  <span className="text-yellow-200 font-medium">
                    "I lost my red water bottle in 5th floor cafeteria"
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-300 mt-0.5">•</span>
                <span>
                  Mention distinctive features:{" "}
                  <span className="text-yellow-200 font-medium">
                    "I lost my black wallet with leather strap"
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mb-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/20 flex items-center gap-3">
            <Search className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you're looking for..."
              className="flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              disabled={isSearching}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Loader className="animate-spin w-5 h-5" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="w-full max-w-5xl">
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin w-12 h-12 text-white mb-4" />
              <p className="text-white text-lg">Searching items...</p>
            </div>
          )}

          {!isSearching && hasSearched && searchResults.length === 0 && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center border border-white/20">
              <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No items found
              </h3>
              <p className="text-gray-600">
                Try using different keywords or be more specific in your search
              </p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-white/90 text-sm mb-4">
                Found {searchResults.length} matching item
                {searchResults.length !== 1 ? "s" : ""}
              </p>
              {searchResults.map((item, index) => (
                <div
                  key={item.item_id || index}
                  className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {item.image_url && !imageError ? (
                      <img
                        src={item.image_url}
                        alt={item.description}
                        onError={() => setImageError(true)}
                        className="w-full md:w-48 h-48 object-cover rounded-xl border-2 border-blue-100"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 bg-gray-200 w-full md:w-48 h-48 rounded-xl">
                        <ImageOff className="w-12 h-12 mb-1" />
                        <p className="text-sm">No Image Available</p>
                      </div>
                    )}

                    <div className="flex-1">
                      {item.match_score && (
                        <p className="text-sm text-blue-600 font-medium">
                          Match Score: {(item.match_score * 100).toFixed(1)}%
                        </p>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {item.category || "Item"}
                        </h3>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {item.location_description && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">
                              {item.location_description}
                            </span>
                          </div>
                        )}

                        {item.date_time_found && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span>{`${formatDate(item.date_time_found).date}, ${
                              formatDate(item.date_time_found).time
                            }`}</span>
                          </div>
                        )}

                        {item.category && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Tag className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span>{item.category}</span>
                          </div>
                        )}

                        {item.status && (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === "available"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Item Details
                  <h2 className="text-2xl text-blue-600 font-medium">
                    Match Score: {(selectedItem.match_score * 100).toFixed(1)}%
                  </h2>
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {selectedItem.image_url && !imageError ? (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.description}
                  onClick={() => setIsPictureModalOpen(true)}
                  className="w-full h-64 object-cover rounded-xl border-2 border-blue-100 mb-4"
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500 rounded-xl mb-4">
                  <ImageOff className="w-12 h-12 mb-1" />
                  <p className="text-sm">No Image Available</p>
                </div>
              )}

              {isPictureModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm"
                  onClick={() => setIsPictureModalOpen(false)}
                >
                  <div
                    className="relative bg-white rounded-xl shadow-2xl p-4 max-w-lg w-full mx-4 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image */}
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.description}
                      className="w-full h-auto rounded-lg object-contain"
                    />

                    {/* Optional description */}
                    {selectedItem.description && (
                      <p className="mt-2 text-gray-700 text-center">
                        {selectedItem.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Description
                  </label>
                  <p className="text-gray-800 mt-1">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.category && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Category
                    </label>
                    <p className="text-gray-800 mt-1">
                      {selectedItem.category}
                    </p>
                  </div>
                )}

                {selectedItem.location_description && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location Found
                    </label>
                    <p className="text-gray-800 mt-1">
                      {selectedItem.location_description}
                    </p>
                  </div>
                )}

                {selectedItem.date_time_found && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Date & Time Found
                    </label>
                    <p className="text-gray-800 mt-1">
                      {`${formatDate(selectedItem.date_time_found).date}, ${
                        formatDate(selectedItem.date_time_found).time
                      }`}
                    </p>
                  </div>
                )}

                {/* Claim Button */}
                <div className="pt-4 border-t border-gray-200">
                  {!isItemClaimed(selectedItem) ? (
                    <button
                      onClick={() => handleClaimItem(selectedItem)}
                      disabled={isClaiming}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isClaiming ? (
                        <>
                          <Loader className="animate-spin w-5 h-5" />
                          Claiming...
                        </>
                      ) : (
                        "Claim This Item"
                      )}
                    </button>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Founder Contact Details
                      </h4>
                      <div className="space-y-1 text-gray-700">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedItem.founder_name || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedItem.founder_email || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Facebook:</span>{" "}
                          {selectedItem.founder_facebook ? (
                            <a
                              href={selectedItem.founder_facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              View Profile
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-2">
                    The founder will be notified with your contact information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
