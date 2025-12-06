import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import {
  Loader2,
  MapPin,
  Calendar,
  Tag,
  ImageOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  Search,
  Filter,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Items = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reported");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Loading states for button actions
  const [founderLoadingId, setFounderLoadingId] = useState(null);
  const [claimerLoadingId, setClaimerLoadingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedIn(true);

      // Check if user is admin
      if (storedUser.is_admin === true) {
        setLoggedIn(false);
        navigate("/admin");
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchItems = async () => {
      try {
        const [reportedRes, claimedRes] = await Promise.all([
          axios.get(`${API_BASE}/api/items/${user.user_id}`),
          axios.get(`${API_BASE}/api/items/claimed-items/${user.user_id}`),
        ]);
        setItems(reportedRes.data);
        setClaimedItems(claimedRes.data);
      } catch (err) {
        console.error("Error loading items:", err);
        toast.error("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user]);

  // Get status info
  const getStatusInfo = (item) => {
    if (item.reunited) {
      return {
        text: "Reunited",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle2,
      };
    }
    if (
      item.is_approved &&
      !item.reunited &&
      item.status !== "A person is attempting to claim" &&
      item.status !== "claimer confirmed" &&
      item.status !== "founder confirmed"
    ) {
      return {
        text: "Available",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: Package,
      };
    }
    if (!item.is_approved && !item.reunited) {
      return {
        text: "Pending Approval",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        icon: Clock,
      };
    }
    if (
      item.status === "A person is attempting to claim" ||
      item.status === "claimer confirmed"
    ) {
      return {
        text: item.status,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: AlertCircle,
      };
    }
    return {
      text: item.status,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      icon: AlertCircle,
    };
  };

  // Filter items based on search and status
  const filterItems = (itemsList) => {
    return itemsList.filter((item) => {
      const matchesSearch =
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (filterStatus === "all") return matchesSearch;

      const statusInfo = getStatusInfo(item);
      const itemStatus = statusInfo.text.toLowerCase();

      return matchesSearch && itemStatus.includes(filterStatus.toLowerCase());
    });
  };

  // Reject claim (Founder Rejecting Claimer)
  const handleRejectClaim = async (itemId) => {
    try {
      setFounderLoadingId(itemId); // reuse founder loading indicator
      await axios.put(`${API_BASE}/api/claim-item/founder-reject`, { itemId });

      toast.success("You rejected the claim request.");

      setItems((prev) =>
        prev.map((i) =>
          i.found_item_id === itemId
            ? { ...i, status: "rejected", founder_confirmed: false }
            : i
        )
      );
    } catch (err) {
      toast.error("Failed to reject claim.");
    } finally {
      setFounderLoadingId(null);
    }
  };

  // Founder confirmation
  const handleFounderConfirm = async (itemId) => {
    try {
      setFounderLoadingId(itemId);
      await axios.put(`${API_BASE}/api/claim-item/founder-confirm`, { itemId });
      toast.success("You confirmed returning the item!");
      setItems((prev) =>
        prev.map((i) =>
          i.found_item_id === itemId
            ? { ...i, founder_confirmed: true, status: "founder confirmed" }
            : i
        )
      );
    } catch {
      toast.error("Failed to confirm return.");
    } finally {
      setFounderLoadingId(null);
    }
  };

  // Claimer confirmation
  const handleClaimerConfirm = async (claimId) => {
    try {
      setClaimerLoadingId(claimId);
      await axios.put(`${API_BASE}/api/claim-item/${claimId}/claimer-confirm`);
      toast.success("You confirmed receiving your item!");
      setClaimedItems((prev) =>
        prev.map((i) =>
          i.claim_request_id === claimId
            ? { ...i, claimer_confirmed: true, status: "claimer confirmed" }
            : i
        )
      );
    } catch {
      toast.error("Failed to confirm receipt.");
    } finally {
      setClaimerLoadingId(null);
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

  const currentItems =
    activeTab === "reported" ? filterItems(items) : filterItems(claimedItems);
  const totalItems =
    activeTab === "reported" ? items.length : claimedItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <div className="text-center mb-10" data-aos="fade-down">
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-3">
            My Items
          </h1>
          <p className="text-blue-100 text-lg">
            Track and manage your reported and claimed items
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8" data-aos="fade-up">
          <button
            onClick={() => {
              setActiveTab("reported");
              setSearchQuery("");
              setFilterStatus("all");
            }}
            className={`px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
              activeTab === "reported"
                ? "bg-white text-blue-700 shadow-xl"
                : "bg-blue-900/50 text-blue-100 hover:bg-blue-900/70"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={20} />
              <span>Reported Items</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab("claimed");
              setSearchQuery("");
              setFilterStatus("all");
            }}
            className={`px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
              activeTab === "claimed"
                ? "bg-white text-blue-700 shadow-xl"
                : "bg-blue-900/50 text-blue-100 hover:bg-blue-900/70"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              <span>Claimed Items</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {claimedItems.length}
              </span>
            </div>
          </button>
        </div>

        {/* Search and Filter Bar */}
        {totalItems > 0 && (
          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8"
            data-aos="fade-up"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by description, category, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  showFilters || filterStatus !== "all"
                    ? "bg-white text-blue-700"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Filter size={20} />
                <span>Filters</span>
                {filterStatus !== "all" && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <label className="text-white font-medium mb-2 block">
                  Status Filter
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "available",
                    "pending",
                    "reunited",
                    "attempting",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === status
                          ? "bg-white text-blue-700"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        {totalItems > 0 && (
          <div className="text-white text-center mb-6">
            <p className="text-lg">
              Showing <span className="font-bold">{currentItems.length}</span>{" "}
              of <span className="font-bold">{totalItems}</span> items
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="animate-spin text-white w-16 h-16 mx-auto mb-4" />
              <p className="text-white text-lg">Loading your items...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            {currentItems.length === 0 ? (
              <div
                className="bg-white rounded-2xl shadow-2xl p-12 text-center"
                data-aos="fade-up"
              >
                <Package className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 text-xl font-semibold mb-2">
                  {searchQuery || filterStatus !== "all"
                    ? "No items match your search"
                    : `No ${activeTab} items yet`}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : activeTab === "reported"
                    ? "Items you report will appear here"
                    : "Items you claim will appear here"}
                </p>
                {(searchQuery || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item, index) => {
                  const statusInfo = getStatusInfo(item);
                  const StatusIcon = statusInfo.icon;
                  const itemId = item.found_item_id || item.claim_request_id;

                  return (
                    <div
                      key={itemId}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative">
                        {item.image_url && !imageErrors[itemId] ? (
                          <img
                            src={item.image_url}
                            alt={item.description}
                            onError={() =>
                              setImageErrors((prev) => ({
                                ...prev,
                                [itemId]: true,
                              }))
                            }
                            className="h-56 w-full object-cover"
                          />
                        ) : (
                          <div className="h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                            <ImageOff className="w-12 h-12 mb-2" />
                            <p className="text-sm font-medium">
                              No Image Available
                            </p>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div
                          className={`absolute top-3 right-3 ${statusInfo.bgColor} ${statusInfo.color} px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm`}
                        >
                          <StatusIcon size={16} />
                          <span className="text-xs font-semibold">
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-gray-900 text-xl line-clamp-2">
                          {item.description}
                        </h3>

                        <div className="space-y-2">
                          {item.category && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Tag size={16} className="flex-shrink-0" />
                              <span className="text-sm">{item.category}</span>
                            </div>
                          )}
                          {item.location_description && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} className="flex-shrink-0" />
                              <span className="text-sm line-clamp-1">
                                {item.location_description}
                              </span>
                            </div>
                          )}
                          {item.date_time_found && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} className="flex-shrink-0" />
                              <span className="text-sm">
                                {new Date(
                                  item.date_time_found
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {activeTab === "claimed" && (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-2">
                                Founder Contact Details
                              </h4>
                              <div className="space-y-1 text-gray-700">
                                <p>
                                  <span className="font-medium">Name:</span>{" "}
                                  {item.founder_name || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {item.founder_email || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Facebook:</span>{" "}
                                  {item.founder_facebook ? (
                                    <a
                                      href={item.founder_facebook}
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
                        </div>

                        {/* Action Buttons */}
                        {activeTab === "reported" && (
                          <>
                            {(item.status ===
                              "A person is attempting to claim" ||
                              item.status === "claimer confirmed") &&
                              !item.founder_confirmed && (
                                <div className="flex flex-col gap-2 mt-3">
                                  {/* Confirm Return Button */}
                                  <button
                                    onClick={() =>
                                      handleFounderConfirm(item.found_item_id)
                                    }
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 flex justify-center items-center gap-2 font-semibold shadow-lg"
                                    disabled={
                                      founderLoadingId === item.found_item_id
                                    }
                                  >
                                    {founderLoadingId === item.found_item_id ? (
                                      <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                      <>
                                        <CheckCircle2 size={20} /> Confirm
                                        Return
                                      </>
                                    )}
                                  </button>

                                  {/* Reject Claim Button */}
                                  <button
                                    onClick={() =>
                                      handleRejectClaim(item.found_item_id)
                                    }
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 flex justify-center items-center gap-2 font-semibold shadow-lg"
                                    disabled={
                                      founderLoadingId === item.found_item_id
                                    }
                                  >
                                    {founderLoadingId === item.found_item_id ? (
                                      <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                      <>
                                        <X size={20} /> Reject Claim
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            {item.founder_confirmed && (
                              <div className="mt-3 bg-green-50 border border-green-200 text-green-700 py-2.5 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} />
                                You confirmed receipt
                              </div>
                            )}
                          </>
                        )}

                        {activeTab === "claimed" && (
                          <>
                            {!item.claimer_confirmed && !item.reunited && (
                              <button
                                onClick={() =>
                                  handleClaimerConfirm(item.claim_request_id)
                                }
                                className="w-full mt-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 flex justify-center items-center gap-2 font-semibold shadow-lg"
                                disabled={
                                  claimerLoadingId === item.claim_request_id
                                }
                              >
                                {claimerLoadingId === item.claim_request_id ? (
                                  <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                  <>
                                    <CheckCircle2 size={20} />
                                    Confirm Received
                                  </>
                                )}
                              </button>
                            )}
                            {item.claimer_confirmed && (
                              <div className="mt-3 bg-green-50 border border-green-200 text-green-700 py-2.5 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} />
                                You confirmed receipt
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Items;
