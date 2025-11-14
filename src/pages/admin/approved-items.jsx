import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import { Search, Package, Trash2, Loader2 } from "lucide-react"; // ← Import Loader2
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ApprovedItems = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [approvedItems, setApprovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null); // ← Loading state for approval

  if (!user || user.is_admin !== true) {
    window.location.href = "/home";
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
        toast.error(err.response?.data?.error || err.message);
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
      toast.success("Item deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReunited = async (id) => {
    try {
      setApprovingId(id); // ← Start loader
      await axios.put(`${API_BASE}/api/admin/approved-items/${id}/reunited`);
      setApprovedItems((prev) =>
        prev.map((item) =>
          item.found_item_id === id ? { ...item, reunited: true } : item
        )
      );
      toast.success("Item marked as reunited!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark item as reunited.");
    } finally {
      setApprovingId(null); // ← Stop loader
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
              There are no approved items to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.found_item_id}
                className="bg-white/90 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl text-gray-400">📦</span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  {item.category && (
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      {item.category}
                    </span>
                  )}
                  <p className="text-gray-800 font-medium text-lg line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span>📍</span>
                      <span className="flex-1">
                        {item.location_description}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>📅</span>
                      <span className="flex-1">
                        {item.date_time_found &&
                          new Date(item.date_time_found).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>👤</span>
                      <span className="flex-1">{item.full_name}</span>
                    </div>
                  </div>

                  {item.admin_approved ? (
                    <p className="text-sm text-green-700 font-medium">
                      <span className="font-medium text-gray-500">Status:</span>{" "}
                      Reunited
                    </p>
                  ) : item.founder_confirmed && item.claimer_confirmed ? (
                    <p className="text-sm text-green-700 font-medium">
                      <span className="font-medium text-gray-500">Status:</span>{" "}
                      Founder and Owner both confirmed
                    </p>
                  ) : (
                    <p
                      className={`text-sm font-medium ${
                        item.status === "available"
                          ? "text-green-700"
                          : "text-black"
                      }`}
                    >
                      <span className="font-medium text-gray-500">Status:</span>{" "}
                      {item.status}
                    </p>
                  )}

                  {/* Approved Return Button */}
                  {!item.reunited &&
                    item.founder_confirmed &&
                    item.claimer_confirmed && (
                      <button
                        onClick={() => handleReunited(item.found_item_id)}
                        className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex justify-center items-center gap-2"
                        disabled={approvingId === item.found_item_id} // disable while loading
                      >
                        {approvingId === item.found_item_id ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          "Approved Return"
                        )}
                      </button>
                    )}

                  {item.reunited && (
                    <p className="text-green-700 font-medium text-center mt-2">
                      Item has been reunited
                    </p>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.found_item_id)}
                    disabled={deletingId === item.found_item_id}
                    className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingId === item.found_item_id ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" /> Delete
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
