import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

// Dynamic imports
// User Pages
const LandingPage = React.lazy(() => import("./pages/landingpage.jsx"));
const Login = React.lazy(() => import("./pages/login.jsx"));
const Homepage = React.lazy(() => import("./pages/homepage.jsx"));
const Items = React.lazy(() => import("./pages/items.jsx"));
const RewardsPage = React.lazy(() => import("./pages/rewards.jsx"));
const NotificationsPage = React.lazy(() => import("./pages/notification.jsx"));
const Profile = React.lazy(() => import("./pages/profile.jsx"));
const Register = React.lazy(() => import("./pages/register.jsx"));
const ForgotPassword = React.lazy(() => import("./pages/forgotpass.jsx"));
const ResetPassword = React.lazy(() => import("./components/resetpass.jsx"));
const PostItem = React.lazy(() => import("./pages/post-found.jsx"));
const SearchItem = React.lazy(() => import("./pages/search-item.jsx"));

// Admin Panel
const AdminPanel = React.lazy(() => import("./pages/admin/admin-panel.jsx"));
const UsersPage = React.lazy(() => import("./pages/admin/users.jsx"));
const ApprovedItems = React.lazy(() =>
  import("./pages/admin/approved-items.jsx")
);
const ReportedItems = React.lazy(() =>
  import("./pages/admin/reported-items.jsx")
);
const AnalyticsPage = React.lazy(() => import("./pages/admin/analytics.jsx"));
const SettingsPage = React.lazy(() => import("./pages/admin/settings.jsx"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
            {/* Spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>

            {/* Loading Text */}
            <p className="text-lg font-semibold text-gray-700 animate-pulse">
              Loading your content...
            </p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/recover" element={<ResetPassword />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/items" element={<Items />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-found" element={<PostItem />} />
          <Route path="/search-item" element={<SearchItem />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/approved" element={<ApprovedItems />} />
          <Route path="/admin/reported" element={<ReportedItems />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
