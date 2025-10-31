import { useEffect, useState } from "react";
import AdminNav from "../../components/admin-nav";
import { Users, Package, CheckCircle, Clock, TrendingUp } from "lucide-react";

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

  if (!user || user.is_admin !== true) {
    navigate("/home");
  }

  useEffect(() => {
    const load = async () => {
      await new Promise((r) => setTimeout(r, 400));
      setAnalytics({
        totalUsers: 156,
        activeListings: 23,
        itemsReunited: 45,
        pendingReports: 8,
        weeklyGrowth: 12.5,
        monthlyActivity: [
          { month: "Jan", reports: 12, reunited: 8 },
          { month: "Feb", reports: 15, reunited: 10 },
          { month: "Mar", reports: 20, reunited: 14 },
          { month: "Apr", reports: 18, reunited: 12 },
        ],
      });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* admin nav */}
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-white text-3xl font-bold mb-6">System Analytics</h2>

        {analytics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Users"
                value={analytics.totalUsers}
                trend={analytics.weeklyGrowth}
              />
              <StatCard
                icon={Package}
                label="Active Listings"
                value={analytics.activeListings}
              />
              <StatCard
                icon={CheckCircle}
                label="Items Reunited"
                value={analytics.itemsReunited}
              />
              <StatCard
                icon={Clock}
                label="Pending Reports"
                value={analytics.pendingReports}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Monthly Activity
              </h3>
              <div className="space-y-4">
                {analytics.monthlyActivity.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{m.month}</span>
                      <span>
                        {m.reports} reports / {m.reunited} reunited
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full"
                        style={{
                          width: `${
                            (m.reunited / Math.max(1, m.reports)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-white">Loading analytics...</div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
