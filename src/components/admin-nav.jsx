import { useNavigate } from "react-router-dom";

const adminNav = () => {
  const navigate = useNavigate();

  // Redirect to /admin when clicking the logo
  const handleLogoClick = () => {
    navigate("/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white/5 backdrop-blur-sm py-4 px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <div
          onClick={handleLogoClick}
          className="text-2xl font-black text-white cursor-pointer"
        >
          Admin Console
        </div>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default adminNav;
