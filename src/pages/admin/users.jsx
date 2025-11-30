import { useEffect, useState } from "react";
import AdminNav from "../../components/admin-nav";
import axios from "axios";
import {
  UserX,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Award,
  Package,
  User,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UsersPage = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  // Data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // Auth check
  useEffect(() => {
    if (!user?.is_admin) {
      navigate("/home");
    }
  }, [user, navigate]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/admin/users`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setDeleting(true);
      await axios.delete(`${API_BASE}/api/admin/users/${userId}`);
      setUsers(users.filter((u) => u.user_id !== userId));
      toast.success("Successfully deleted user!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.error || "Failed to delete user", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
      setSelectedUser(null);
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Computed values
  const filteredAndSortedUsers = users
    .filter(
      (u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      return sortConfig.direction === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

  const stats = {
    totalUsers: users.length,
    totalPoints: users.reduce((sum, u) => sum + (u.points || 0), 0),
    totalItems: users.reduce((sum, u) => sum + (u.items_reported || 0), 0),
    totalRedemptions: users.reduce(
      (sum, u) => sum + (u.total_redemptions || 0),
      0
    ),
  };

  const getDaysActive = (createdAt) => {
    if (!createdAt) return 0;
    return Math.floor(
      (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      <ToastContainer />
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-white text-4xl font-bold mb-6">User Dashboard</h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={User}
            color="blue"
          />
          <StatCard
            label="Total Points"
            value={stats.totalPoints.toLocaleString()}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            label="Items Reported"
            value={stats.totalItems}
            icon={Package}
            color="purple"
          />
          <StatCard
            label="Redemptions"
            value={stats.totalRedemptions}
            icon={Award}
            color="orange"
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by username, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : filteredAndSortedUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <UsersTable
            users={filteredAndSortedUsers}
            sortConfig={sortConfig}
            onSort={handleSort}
            onUserClick={setSelectedUser}
            onDeleteClick={setDeleteConfirm}
          />
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          getDaysActive={getDaysActive}
        />
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
          confirmText={deleting ? "Deleting..." : "Delete"}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          disabled={deleting}
        />
      )}
    </div>
  );
};

// Sub-components
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={colorMap[color]} size={32} />
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
    <p className="text-gray-600">Loading users...</p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
    <p className="text-red-600">Error: {error}</p>
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
    <p className="text-gray-600">No users found</p>
  </div>
);

const SortableHeader = ({ label, sortKey, sortConfig, onSort }) => (
  <th
    onClick={() => onSort(sortKey)}
    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
  >
    <div className="flex items-center gap-2">
      {label}
      <ArrowUpDown size={14} />
    </div>
  </th>
);

const UsersTable = ({
  users,
  sortConfig,
  onSort,
  onUserClick,
  onDeleteClick,
}) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <SortableHeader
              label="Username"
              sortKey="username"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Full Name"
              sortKey="full_name"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <SortableHeader
              label="Points"
              sortKey="points"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Items
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Redemptions
            </th>
            <SortableHeader
              label="Joined"
              sortKey="created_at"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr
              key={u.user_id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onUserClick(u)}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {u.username}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{u.full_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {u.points || 0} pts
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {u.items_reported || 0}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {u.total_redemptions || 0}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(u.user_id);
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete user"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserDetailsModal = ({ user, onClose, getDaysActive }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {user.full_name}
            </h3>
            <p className="text-blue-100">@{user.username}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Contact Information
          </h4>
          <div className="space-y-2 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>
            {user.facebook_account_link && (
              <div className="flex justify-between">
                <span className="text-gray-600">Facebook:</span>
                <a
                  href={user.facebook_account_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            User Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <UserStat
              icon={TrendingUp}
              value={user.points || 0}
              label="Points"
              bgColor="green"
            />
            <UserStat
              icon={Package}
              value={user.items_reported || 0}
              label="Items Reported"
              bgColor="purple"
            />
            <UserStat
              icon={Award}
              value={user.total_redemptions || 0}
              label="Redemptions"
              bgColor="orange"
            />
            <UserStat
              icon={User}
              value={getDaysActive(user.created_at)}
              label="Days Active"
              bgColor="blue"
            />
          </div>
        </div>

        {/* Account Details */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Account Details
          </h4>
          <div className="space-y-2 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="text-gray-900 font-medium">{user.user_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Created:</span>
              <span className="text-gray-900 font-medium">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span
                className={`font-medium ${
                  user.is_admin ? "text-red-600" : "text-green-600"
                }`}
              >
                {user.is_admin ? "Admin" : "Regular User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UserStat = ({ icon: Icon, value, label, bgColor }) => {
  const colorMap = {
    green: { bg: "bg-green-50", text: "text-green-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
  };

  const colors = colorMap[bgColor];

  return (
    <div className={`${colors.bg} rounded-lg p-4 text-center`}>
      <Icon className={`mx-auto ${colors.text} mb-2`} size={24} />
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

const ConfirmModal = ({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  disabled,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 rounded-full">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          disabled={disabled}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default UsersPage;
