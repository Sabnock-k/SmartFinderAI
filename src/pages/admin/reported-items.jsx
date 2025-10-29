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
      return;
    }
  };

  const handleReject = async (id) => {
    try {
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
      return;
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
      {/* admin nav */}
      <AdminNav />
      <ToastContainer />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-white text-3xl font-bold mb-4">Reported Items</h1>
        {/* filters and search bar */}
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

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <ClipLoader color="#ffffff" size={50} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white/90 rounded-xl p-8 text-center">
              <Package className="mx-auto w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-700">No pending reports</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.found_item_id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.image_url}
                      alt={item.description}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">
                          {item.description}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-1">
                          {item.category}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Pending Review
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <p>
                        <strong>Location:</strong> {item.location_description}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(item.date_time_found).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Reported by:</strong> {item.full_name}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(item.date_time_found).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.found_item_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.found_item_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportedItems;
