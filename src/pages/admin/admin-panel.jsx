import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/admin-nav.jsx";
import useAuth from "../../../api/hooks/useAuth.js";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, authChecked } = useAuth();

  useEffect(() => {
    if (authChecked && user) {
      if (user.is_admin !== true) {
        navigate("/home");
      }
    }
  }, [authChecked, user]);

  useEffect(() => {
    // Protect admin panel — redirect if not admin or not logged in
    if (user === null) return; // wait until user is loaded

    if (!user.is_admin) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const cards = [
    {
      id: "reported",
      title: "Reported Items",
      desc: "Review pending reports",
      route: "/admin/reported",
      emoji: "📦",
    },
    {
      id: "approved",
      title: "Approved Items",
      desc: "Manage approved listings",
      route: "/admin/approved",
      emoji: "✅",
    },
    {
      id: "users",
      title: "Users",
      desc: "Manage users & bans",
      route: "/admin/users",
      emoji: "👥",
    },
    {
      id: "analytics",
      title: "Analytics",
      desc: "System metrics",
      route: "/admin/analytics",
      emoji: "📊",
    },
    {
      id: "settings",
      title: "Settings",
      desc: "System configuration",
      route: "/admin/settings",
      emoji: "⚙️",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background Pattern - same as homepage */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* admin nav */}
      <AdminNav />

      <main className="flex flex-1 flex-col items-center w-full px-4 pt-12 z-10">
        <div className="w-full max-w-4xl text-center mb-8" data-aos="fade-in">
          <h1 className="font-black text-white text-4xl md:text-5xl mb-2">
            Admin Console
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Quick access to reported items, users, analytics and settings.
          </p>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(c.route)}
              className={`rounded-2xl p-6 shadow-lg text-gray-800 text-left transform hover:scale-105 transition flex flex-col justify-between bg-white/95`}
              data-aos="zoom-in"
            >
              <div>
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h2 className="text-xl font-bold">{c.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
              </div>
              <div className="mt-4 text-xs text-gray-500">Open</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
