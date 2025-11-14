import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import { Search, Package, Check, X, Eye } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ReportedItems = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  if (!user || user.is_admin !== true) {
    navigate("/home");
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/api/admin/reported-items`
        );
        setReportedItems(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching reported items:", err);
        alert(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE}/api/admin/reported-items/${id}/approve`);
      setReportedItems((p) => p.filter((i) => i.found_item_id !== id));
      toast.success("Item approved successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error approving reported item:", err);
      toast.error(err.response?.data?.error || "Failed to approve item", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/admin/reported-items/${id}/reject`);
      setReportedItems((p) => p.filter((i) => i.found_item_id !== id));
      toast.success("Item rejected successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error rejecting reported item:", err);
      toast.error(err.response?.data?.error || "Failed to reject item", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
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

  const filtered = reportedItems.filter((it) => {
    if (filterCategory !== "all" && it.category !== filterCategory)
      return false;
    if (!searchQuery) return true;
    return it.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      <AdminNav />
      <ToastContainer />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-black text-white text-4xl md:text-5xl mb-4 drop-shadow-lg tracking-tight">
            Reported Items
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/90 rounded-2xl p-12 shadow-lg text-center">
            <Package className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Pending Reports
            </h2>
            <p className="text-gray-600">
              All reports have been reviewed. Great job!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.found_item_id}
                className="bg-white/90 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      {item.category && (
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                      Pending Review
                    </span>
                  </div>

                  <p className="text-gray-800 font-medium mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <span>📍</span>
                      <span className="flex-1">
                        {item.location_description}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>📅</span>
                      <span className="flex-1">
                        {new Date(item.date_time_found).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>🕐</span>
                      <span className="flex-1">
                        {new Date(item.date_time_found).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>👤</span>
                      <span className="flex-1">{item.full_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.found_item_id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.found_item_id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedItems;
