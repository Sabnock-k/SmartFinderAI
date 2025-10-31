import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import { Search, Package, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ApprovedItems = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [approvedItems, setApprovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  if (!user || user.is_admin !== true) {
    navigate("/home");
  }

  useEffect(() => {
    const fetchApprovedItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/api/admin/approved-items`
        );
        setApprovedItems(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching approved items:", err);
        alert(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setDeletingId(id);
      await axios.delete(`${API_BASE}/api/admin/approved-items/${id}`);
      setApprovedItems((p) => p.filter((i) => i.found_item_id !== id));
      toast.success("Item deleted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting approved item:", err);
      toast.error(err.response?.data?.error || "Failed to delete item", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setDeletingId(null);
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

  const filtered = approvedItems.filter((it) => {
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
            Approved Items
          </h1>
          <p className="text-lg text-blue-100">
            {approvedItems.length}{" "}
            {approvedItems.length === 1 ? "item" : "items"} approved
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <ClipLoader size={50} color="#fff" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/90 rounded-2xl p-12 shadow-lg text-center">
            <Package className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Approved Items
            </h2>
            <p className="text-gray-600">
              There are no approved items to display at the moment.
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
                      <span>👤</span>
                      <span className="flex-1">{item.full_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(item.found_item_id)}
                    disabled={deletingId === item.found_item_id}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingId === item.found_item_id ? (
                      <ClipLoader size={16} color="#ffffff" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedItems;
