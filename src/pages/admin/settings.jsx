import AdminNav from "../../components/admin-nav";

const SettingsPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.is_admin !== true) {
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* admin nav */}
      <AdminNav />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-white text-3xl font-bold mb-6">System Settings</h2>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Auto-Approve Items
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
              <option>Require manual approval</option>
              <option>Auto-approve all</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Expiration (days)
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />{" "}
                <span className="text-gray-700">New item reports</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />{" "}
                <span className="text-gray-700">Item matches found</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />{" "}
                <span className="text-gray-700">Daily summary reports</span>
              </label>
            </div>
          </div>
          <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
