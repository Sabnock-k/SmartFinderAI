import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage.jsx";
import Login from "./pages/Login.jsx";
import Homepage from "./pages/homepage.jsx";
import Profile from "./pages/profile.jsx";
import Register from "./pages/register.jsx";
import ForgotPassword from "./pages/forgotpass.jsx";
import ResetPassword from "./components/resetpass.jsx";
import PostItem from "./pages/post-found.jsx"; // Ensure this import matches the updated export in post-found.jsx\
import ClaimItem from "./pages/claim-item.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recover" element={<ResetPassword />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-found" element={<PostItem />} />
        <Route path="/claim-item" element={<ClaimItem />} />
      </Routes>
    </Router>
  );
}

export default App;
