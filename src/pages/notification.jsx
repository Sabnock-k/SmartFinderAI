import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  Trash2,
  MapPin,
  Calendar,
  Package,
  ArrowLeft,
  Check,
  X,
  Filter,
  Search,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NotificationsPage = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchNotifications(storedUser.user_id);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter, searchTerm]);

  const fetchNotifications = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/api/notifications/${userId}`
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Filter by type
    if (filter !== "all") {
      filtered = filtered.filter((n) =>
        n.message.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.item_description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          n.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE}/api/notifications/${notificationId}`);
      setNotifications(
        notifications.filter((n) => n.notification_id !== notificationId)
      );
      toast.success("Notification removed", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to remove notification", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleClearAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }
    try {
      await axios.delete(`${API_BASE}/api/notifications/clear/${user.user_id}`);
      setNotifications([]);
      toast.success("All notifications cleared", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60)
      return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getNotificationIcon = (message) => {
    if (message.toLowerCase().includes("found")) return "📦";
    if (message.toLowerCase().includes("claimed")) return "🤝";
    if (message.toLowerCase().includes("approved")) return "✅";
    if (message.toLowerCase().includes("rejected")) return "❌";
    return "🔔";
  };

  const handleViewItem = () => {
    navigate("/items");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      <ToastContainer />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowLeft size={24} className="text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Notifications
                  </h1>
                  <p className="text-blue-200 text-sm">
                    {notifications.length} total notification
                    {notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAllNotifications}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
              />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <div className="flex gap-2">
              {["all", "found", "claimed", "approved", "rejected"].map(
                (filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === filterType
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-blue-200 hover:bg-white/20"
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ClipLoader size={50} color="#fff" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-12 text-center">
            <div className="inline-block p-6 bg-blue-500/20 rounded-full mb-4">
              <Bell size={64} className="text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchTerm || filter !== "all"
                ? "No matching notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-blue-200">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter"
                : "You'll be notified when someone finds an item matching your lost items"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.notification_id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.01] animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                      {getNotificationIcon(notification.message)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Message */}
                    <p className="text-white text-lg font-medium mb-3 leading-relaxed">
                      {notification.message}
                    </p>

                    {/* Item Details Card */}
                    {(notification.item_image ||
                      notification.item_description ||
                      notification.location ||
                      notification.date_found) && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                        <div className="flex gap-4">
                          {notification.item_image && (
                            <img
                              src={notification.item_image}
                              alt="Item"
                              className="w-20 h-20 rounded-lg object-cover border-2 border-white/20 shadow-md flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 space-y-2">
                            {notification.item_description && (
                              <div className="flex items-start gap-2">
                                <Package
                                  size={16}
                                  className="text-blue-300 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-blue-100 text-sm">
                                  {notification.item_description}
                                </span>
                              </div>
                            )}
                            {notification.location && (
                              <div className="flex items-center gap-2">
                                <MapPin
                                  size={16}
                                  className="text-blue-300 flex-shrink-0"
                                />
                                <span className="text-blue-100 text-sm">
                                  {notification.location}
                                </span>
                              </div>
                            )}
                            {notification.date_found && (
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={16}
                                  className="text-blue-300 flex-shrink-0"
                                />
                                <span className="text-blue-100 text-sm">
                                  {new Date(
                                    notification.date_found
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-300 font-medium">
                        {formatDate(notification.created_at)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleViewItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                        >
                          <Package size={16} />
                          View Item
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteNotification(
                              notification.notification_id
                            )
                          }
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                          title="Delete notification"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
