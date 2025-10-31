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
      {/* admin nav */}
      <AdminNav />
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 py-10">
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

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-white text-3xl font-bold">Approved Items</h2>
          <span className="text-white/90">{approvedItems.length} items</span>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <ClipLoader size={50} color="#fff" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white/90 rounded-xl p-8 text-center">
              <Package className="mx-auto w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-700">No Approved Items</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.found_item_id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{item.description}</h3>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.found_item_id)}
                    disabled={deletingId === item.found_item_id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
                  >
                    {deletingId === item.found_item_id ? (
                      <ClipLoader size={20} color="#dc2626" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>
                    <strong>Location:</strong> {item.location_description}
                  </p>
                  <p>
                    <strong>Found:</strong>{" "}
                    {new Date(item.date_time_found).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Reported by:</strong> {item.full_name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedItems;
