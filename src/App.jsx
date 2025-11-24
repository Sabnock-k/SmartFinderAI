import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage.jsx";
import Login from "./pages/login.jsx";
import Homepage from "./pages/homepage.jsx";
import Items from "./pages/items.jsx";
import RewardsPage from "./pages/rewards.jsx";
import Profile from "./pages/profile.jsx";
import Register from "./pages/register.jsx";
import ForgotPassword from "./pages/forgotpass.jsx";
import ResetPassword from "./components/resetpass.jsx";
import PostItem from "./pages/post-found.jsx";
import SearchItem from "./pages/search-item.jsx";
//import TestPage from "./pages/test-page.jsx";

// Admin Panel
import AdminPanel from "./pages/admin/admin-panel.jsx";
import UsersPage from "./pages/admin/users.jsx";
import ApprovedItems from "./pages/admin/approved-items.jsx";
import ReportedItems from "./pages/admin/reported-items.jsx";
import AnalyticsPage from "./pages/admin/analytics.jsx";
import SettingsPage from "./pages/admin/settings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/test" element={<TestPage />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recover" element={<ResetPassword />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/items" element={<Items />} />
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
    </Router>
  );
}

export default App;
