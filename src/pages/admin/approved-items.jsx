import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import {
  Search,
  Package,
  Trash2,
  CheckCircle2,
  Filter,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
  Award,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ApprovedItems = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [approvedItems, setApprovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [reunitingId, setReunitingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.is_admin !== true) {
      window.location.href = "/home";
    }
  }, [user]);

  const fetchApprovedItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/admin/approved-items`);
      setApprovedItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching approved items:", err);
      setError(
        err.response?.data?.error || "Failed to load items. Please try again."
      );
      toast.error(
        err.response?.data?.error || "Failed to load approved items",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedItems();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE}/api/admin/approved-items/${id}`);
      setApprovedItems((prev) =>
        prev.filter((item) => item.found_item_id !== id)
      );
      setSelectedItem(null);
      toast.success("Item deleted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(err.response?.data?.error || "Failed to delete item", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleReunited = async (id) => {
    if (
      !window.confirm(
        "Confirm that this item has been successfully returned to its owner? The reporter will earn 100 points."
      )
    ) {
      return;
    }

    try {
      setReunitingId(id);
      await axios.put(`${API_BASE}/api/admin/approved-items/${id}/reunited`);
      setApprovedItems((prev) =>
        prev.map((item) =>
          item.found_item_id === id
            ? {
                ...item,
                reunited: true,
                admin_approved: true,
                status: "reunited",
              }
            : item
        )
      );
      setSelectedItem(null);
      toast.success("Item marked as reunited! Reporter earned 100 points.", {
        position: "top-center",
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Error marking item as reunited:", err);
      toast.error(
        err.response?.data?.error || "Failed to mark item as reunited",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      setReunitingId(null);
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

  const statusFilters = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "pending", label: "Pending Claim" },
    { value: "confirmed", label: "Both Confirmed" },
    { value: "reunited", label: "Reunited" },
  ];

  const getItemStatus = (item) => {
    if (item.reunited || item.admin_approved) return "reunited";
    if (item.founder_confirmed && item.claimer_confirmed) return "confirmed";
    if (item.status === "claimed") return "pending";
    return "available";
  };

  const filtered = approvedItems.filter((item) => {
    // Category filter
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false;

    // Status filter
    const itemStatus = getItemStatus(item);
    if (filterStatus !== "all" && itemStatus !== filterStatus) return false;

    // Search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.description?.toLowerCase().includes(query) ||
      item.location_description?.toLowerCase().includes(query) ||
      item.full_name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: approvedItems.length,
    available: approvedItems.filter((i) => getItemStatus(i) === "available")
      .length,
    pending: approvedItems.filter((i) => getItemStatus(i) === "pending").length,
    confirmed: approvedItems.filter((i) => getItemStatus(i) === "confirmed")
      .length,
    reunited: approvedItems.filter((i) => getItemStatus(i) === "reunited")
      .length,
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      available: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Available",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending Claim",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Both Confirmed",
      },
      reunited: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Reunited",
      },
    };
    const config = configs[status] || configs.available;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} text-xs font-bold rounded-full`}
      >
        {status === "reunited" && <Award className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

  const ItemDetailModal = ({ item, onClose }) => {
    const itemStatus = getItemStatus(item);

    return (
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
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.description}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center"
              style={{ display: item.image_url ? "none" : "flex" }}
            >
              <Package className="w-20 h-20 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Category
                  </label>
                  <p className="text-lg text-gray-800 mt-1">
                    {item.category || "N/A"}
                  </p>
                </div>
                <StatusBadge status={itemStatus} />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Description
                </label>
                <p className="text-lg text-gray-800 mt-1">{item.description}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Location Found
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

              {/* Claim Status */}
              {(item.founder_confirmed || item.claimer_confirmed) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Claim Confirmation Status
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          item.founder_confirmed
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      />
                      <span>
                        Founder Confirmed:{" "}
                        {item.founder_confirmed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          item.claimer_confirmed
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      />
                      <span>
                        Claimer Confirmed:{" "}
                        {item.claimer_confirmed ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              {!item.reunited &&
                item.founder_confirmed &&
                item.claimer_confirmed && (
                  <button
                    onClick={() => handleReunited(item.found_item_id)}
                    disabled={reunitingId === item.found_item_id}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reunitingId === item.found_item_id ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Reunited
                      </>
                    )}
                  </button>
                )}
              <button
                onClick={() => handleDelete(item.found_item_id)}
                disabled={deletingId === item.found_item_id}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === item.found_item_id ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete Item
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      <AdminNav />
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-white text-4xl md:text-5xl mb-2 drop-shadow-lg">
            Approved Items
          </h1>
          <p className="text-white/90 text-lg">
            Manage all approved found items
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-white/80 text-sm">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">
              {stats.available}
            </div>
            <div className="text-white/80 text-sm">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">
              {stats.pending}
            </div>
            <div className="text-white/80 text-sm">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300">
              {stats.confirmed}
            </div>
            <div className="text-white/80 text-sm">Confirmed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">
              {stats.reunited}
            </div>
            <div className="text-white/80 text-sm">Reunited</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by description, location, reporter, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <button
                onClick={fetchApprovedItems}
                disabled={loading}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
                title="Refresh items"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All Categories" : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white cursor-pointer"
                >
                  {statusFilters.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
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
                onClick={fetchApprovedItems}
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
            <ClipLoader size={60} color="#fff" />
            <p className="text-white text-lg mt-4">Loading approved items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/95 rounded-2xl p-16 shadow-lg text-center">
            <Package className="mx-auto w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {searchQuery || filterCategory !== "all" || filterStatus !== "all"
                ? "No Matching Items"
                : "No Approved Items"}
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              {searchQuery || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "There are no approved items to display"}
            </p>
            {(searchQuery ||
              filterCategory !== "all" ||
              filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-white/80 text-sm mb-4">
              Showing {filtered.length} of {approvedItems.length} items
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => {
                const itemStatus = getItemStatus(item);

                return (
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
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ display: item.image_url ? "none" : "flex" }}
                      >
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={itemStatus} />
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
                            {new Date(
                              item.date_time_found
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Claim Status Indicator */}
                      {(item.founder_confirmed || item.claimer_confirmed) && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3 text-xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-3 h-3 ${
                                item.founder_confirmed
                                  ? "text-green-600"
                                  : "text-gray-300"
                              }`}
                            />
                            <span>
                              Founder: {item.founder_confirmed ? "✓" : "✗"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-3 h-3 ${
                                item.claimer_confirmed
                                  ? "text-green-600"
                                  : "text-gray-300"
                              }`}
                            />
                            <span>
                              Claimer: {item.claimer_confirmed ? "✓" : "✗"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-2 pt-3 border-t">
                        {!item.reunited &&
                          item.founder_confirmed &&
                          item.claimer_confirmed && (
                            <button
                              onClick={() => handleReunited(item.found_item_id)}
                              disabled={reunitingId === item.found_item_id}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {reunitingId === item.found_item_id ? (
                                <ClipLoader size={16} color="#fff" />
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Mark as Reunited
                                </>
                              )}
                            </button>
                          )}

                        {item.reunited && (
                          <div className="bg-purple-50 text-purple-700 rounded-lg p-3 text-center font-semibold text-sm flex items-center justify-center gap-2">
                            <Award className="w-4 h-4" />
                            Item Successfully Reunited
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(item.found_item_id)}
                            disabled={deletingId === item.found_item_id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === item.found_item_id ? (
                              <ClipLoader size={16} color="#fff" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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

export default ApprovedItems;
