import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import { Users, Package, CheckCircle, Clock, TrendingUp } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-8 h-8 text-gray-600" />
      {trend && (
        <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />+{trend}%
        </span>
      )}
    </div>
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const AnalyticsPage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.is_admin !== true) {
      window.location.href = "/home";
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/admin/analytics`);

        setAnalytics({
          totalUsers: response.data.userCount,
          activeListings: response.data.approvedCount,
          pendingReports: response.data.pendingCount,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-white text-center text-xl">
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* admin nav */}
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-white text-3xl font-bold mb-6">System Analytics</h2>

        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Users"
                value={analytics.totalUsers}
              />
              <StatCard
                icon={Package}
                label="Active Listings"
                value={analytics.activeListings}
              />
              <StatCard
                icon={Clock}
                label="Pending Reports"
                value={analytics.pendingReports}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Total Registered Users
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {analytics.totalUsers}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Approved Items
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.activeListings}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">
                    Pending Approvals
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {analytics.pendingReports}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
