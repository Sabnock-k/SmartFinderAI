import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import {
  Search,
  Package,
  Check,
  X,
  Eye,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ReportedItems = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.is_admin !== true) {
      window.location.href = "/home";
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/admin/reported-items`);
      setReportedItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching reported items:", err);
      setError(
        err.response?.data?.error || "Failed to load items. Please try again."
      );
      toast.error(err.response?.data?.error || "Failed to load items", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await axios.put(`${API_BASE}/api/admin/reported-items/${id}/approve`);
      setReportedItems((prev) =>
        prev.filter((item) => item.found_item_id !== id)
      );
      setSelectedItem(null);
      toast.success("Item approved! Reporter earned 20 points.", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error approving item:", err);
      toast.error(err.response?.data?.error || "Failed to approve item", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await axios.delete(`${API_BASE}/api/admin/reported-items/${id}/reject`);
      setReportedItems((prev) =>
        prev.filter((item) => item.found_item_id !== id)
      );
      setSelectedItem(null);
      toast.success("Item rejected successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error rejecting item:", err);
      toast.error(err.response?.data?.error || "Failed to reject item", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const categories = [
    "all",
    "Electronics",
    "Clothing",
    "Accessories",
    "Books",
    "Keys",
    "Bags",
    "Documents",
    "Jewelry",
    "Sports Equipment",
    "Other",
  ];

  const filtered = reportedItems.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.description?.toLowerCase().includes(query) ||
      item.location_description?.toLowerCase().includes(query) ||
      item.full_name?.toLowerCase().includes(query)
    );
  });

  const ItemDetailModal = ({ item, onClose }) => (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.description}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Category
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {item.category || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Description
              </label>
              <p className="text-lg text-gray-800 mt-1">{item.description}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Location
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {item.location_description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Date Found
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {new Date(item.date_time_found).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Time Found
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {new Date(item.date_time_found).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Reported By
              </label>
              <p className="text-lg text-gray-800 mt-1">{item.full_name}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Reported On
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={() => handleApprove(item.found_item_id)}
              disabled={actionLoading === item.found_item_id}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === item.found_item_id ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Approve
                </>
              )}
            </button>
            <button
              onClick={() => handleReject(item.found_item_id)}
              disabled={actionLoading === item.found_item_id}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === item.found_item_id ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <>
                  <X className="w-5 h-5" />
                  Reject
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      <AdminNav />
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-white text-4xl md:text-5xl mb-2 drop-shadow-lg">
            Reported Items Review
          </h1>
          <p className="text-white/90 text-lg">
            Review and manage pending item reports
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 flex flex-wrap gap-4 justify-center">
          <div className="text-center px-4">
            <div className="text-3xl font-bold text-white">
              {reportedItems.length}
            </div>
            <div className="text-white/80 text-sm">Total Pending</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-bold text-white">
              {filtered.length}
            </div>
            <div className="text-white/80 text-sm">Filtered Results</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by description, location, or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All Categories" : c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchItems}
                disabled={loading}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh items"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">
                Error Loading Items
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchItems}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ClipLoader color="#ffffff" size={60} />
            <p className="text-white text-lg mt-4">Loading reported items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/95 rounded-2xl p-16 shadow-lg text-center">
            <Package className="mx-auto w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {searchQuery || filterCategory !== "all"
                ? "No Matching Items"
                : "No Pending Reports"}
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              {searchQuery || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "All reports have been reviewed. Great job!"}
            </p>
            {(searchQuery || filterCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.found_item_id}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                      PENDING
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {item.category && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3">
                      {item.category}
                    </span>
                  )}

                  <p className="text-gray-900 font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
                    {item.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span className="line-clamp-1">
                        {item.location_description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">👤</span>
                      <span className="font-medium">{item.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📅</span>
                      <span>
                        {new Date(item.date_time_found).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(item.found_item_id);
                      }}
                      disabled={actionLoading === item.found_item_id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === item.found_item_id ? (
                        <ClipLoader color="#ffffff" size={16} />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(item.found_item_id);
                      }}
                      disabled={actionLoading === item.found_item_id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === item.found_item_id ? (
                        <ClipLoader color="#ffffff" size={16} />
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default ReportedItems;
