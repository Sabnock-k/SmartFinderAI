import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin-nav";
import {
  Users,
  Package,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Activity,
  Award,
  Target,
  BarChart3,
  Heart,
  Gift,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  subtitle,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    pink: "from-pink-500 to-pink-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg shadow-md`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <span
            className={`${
              trend >= 0 ? "text-green-600" : "text-red-600"
            } text-sm font-semibold flex items-center gap-1 bg-opacity-10 px-2 py-1 rounded ${
              trend >= 0 ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

const ProgressBar = ({ label, value, total, color = "blue" }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-800">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`${colorClasses[color]} h-full rounded-full transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
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
        const data = response.data;

        const totalItems = data.approvedCount + data.pendingCount;
        const approvalRate =
          totalItems > 0
            ? ((data.approvedCount / totalItems) * 100).toFixed(1)
            : 0;
        const claimRate =
          data.totalClaims > 0
            ? ((data.approvedClaims / data.totalClaims) * 100).toFixed(1)
            : 0;

        setAnalytics({
          // Core metrics
          totalUsers: data.userCount,
          recentUsers: data.recentUsers,
          activeListings: data.approvedCount,
          pendingReports: data.pendingCount,
          reunitedItems: data.reunitedCount,

          // Calculated metrics
          totalItems,
          approvalRate: parseFloat(approvalRate),
          successRate: data.successRate,

          // Claim metrics
          totalClaims: data.totalClaims,
          pendingClaims: data.pendingClaims,
          approvedClaims: data.approvedClaims,
          claimRate: parseFloat(claimRate),

          // Reward metrics
          totalRedemptions: data.totalRedemptions,
          recentRedemptions: data.recentRedemptions,
          totalPointsDistributed: data.totalPointsDistributed,

          // Additional data
          recentItems: data.recentItems,
          avgResponseTimeDays: data.avgResponseTimeDays,
          categoryStats: data.categoryStats || [],
          topContributors: data.topContributors || [],
          statusBreakdown: data.statusBreakdown || [],
          recentActivity: data.recentActivity || [],
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.response?.data?.error || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-12 h-12 text-white animate-pulse mx-auto mb-4" />
              <div className="text-white text-xl">Loading analytics...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] pb-12">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-white text-4xl font-bold mb-2">
            System Analytics Dashboard
          </h2>
          <p className="text-blue-200 text-lg">
            Real-time insights and performance metrics
          </p>
        </div>

        {analytics && (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Users"
                value={analytics.totalUsers}
                trend={analytics.recentUsers}
                color="blue"
                subtitle={`${analytics.recentUsers} new this month`}
              />
              <StatCard
                icon={CheckCircle}
                label="Active Listings"
                value={analytics.activeListings}
                color="green"
                subtitle="Approved items"
              />
              <StatCard
                icon={Clock}
                label="Pending Review"
                value={analytics.pendingReports}
                color="orange"
                subtitle="Awaiting approval"
              />
              <StatCard
                icon={Heart}
                label="Reunited"
                value={analytics.reunitedItems}
                color="pink"
                subtitle={`${analytics.successRate}% success rate`}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Package}
                label="Total Items"
                value={analytics.totalItems}
                color="purple"
                subtitle="All submissions"
              />
              <StatCard
                icon={Target}
                label="Claim Requests"
                value={analytics.totalClaims}
                color="cyan"
                subtitle={`${analytics.pendingClaims} pending`}
              />
              <StatCard
                icon={Gift}
                label="Redemptions"
                value={analytics.totalRedemptions}
                color="purple"
                subtitle={`${analytics.recentRedemptions} this month`}
              />
              <StatCard
                icon={Award}
                label="Points Given"
                value={analytics.totalPointsDistributed.toLocaleString()}
                color="orange"
                subtitle="Total rewards"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Item Status Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Item Status Distribution
                </h3>
                <ProgressBar
                  label="Approved Items"
                  value={analytics.activeListings}
                  total={analytics.totalItems}
                  color="green"
                />
                <ProgressBar
                  label="Pending Review"
                  value={analytics.pendingReports}
                  total={analytics.totalItems}
                  color="orange"
                />
                <ProgressBar
                  label="Reunited with Owners"
                  value={analytics.reunitedItems}
                  total={analytics.totalItems}
                  color="pink"
                />
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm font-medium">
                      Approval Rate
                    </span>
                    <p className="text-2xl font-bold text-green-600">
                      {analytics.approvalRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm font-medium">
                      Success Rate
                    </span>
                    <p className="text-2xl font-bold text-pink-600">
                      {analytics.successRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Analytics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-cyan-600" />
                  Claim Request Analytics
                </h3>
                <ProgressBar
                  label="Approved Claims"
                  value={analytics.approvedClaims}
                  total={analytics.totalClaims}
                  color="green"
                />
                <ProgressBar
                  label="Pending Review"
                  value={analytics.pendingClaims}
                  total={analytics.totalClaims}
                  color="orange"
                />
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm font-medium">
                        Claim Rate
                      </span>
                      <p className="text-2xl font-bold text-cyan-600">
                        {analytics.claimRate}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm font-medium">
                        Avg Response
                      </span>
                      <p className="text-2xl font-bold text-blue-600">
                        {analytics.avgResponseTimeDays} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Contributors */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {analytics.topContributors.length > 0 ? (
                    analytics.topContributors.map((contributor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-600"
                                : "bg-blue-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {contributor.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{contributor.username}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            {contributor.items_found} items
                          </p>
                          <p className="text-xs text-gray-500">
                            {contributor.points} points
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No contributors yet
                    </p>
                  )}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-purple-600" />
                  Popular Categories
                </h3>
                <div className="space-y-3">
                  {analytics.categoryStats.length > 0 ? (
                    analytics.categoryStats.map((cat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700 font-medium capitalize">
                          {cat.category || "Uncategorized"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  (cat.count /
                                    analytics.categoryStats[0].count) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-gray-800 font-bold w-12 text-right">
                            {cat.count}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No category data available
                    </p>
                  )}
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
