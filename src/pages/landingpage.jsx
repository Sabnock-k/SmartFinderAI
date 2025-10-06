import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: false }); // once = animate only first time
  }, []);

  return (
    <div className="w-full h-full overflow-x-hidden scroll-smooth">
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
        </div>

        {/* Logo */}
        <div
          className="flex flex-col items-center md:absolute top-3 left-3 cursor-pointer z-10"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 sm:w-36 h-auto drop-shadow-lg"
          />
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col justify-center items-center text-center w-full px-8 lg:px-20"
          data-aos="zoom-in"
        >
          <h1 className="text-3xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Don't panic, CampusFind's on it
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed">
            AI-powered lost and found for School Campuses — connecting
            communities, reuniting people with what matters.
          </p>
          <button
            className="mt-8 px-8 py-4 bg-white text-blue-800 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-8 lg:px-20 py-16"
      >
        <div className="max-w-4xl text-center" data-aos="flip-left">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            About CampusFind
          </h2>
          <p className="text-lg lg:text-xl leading-relaxed mb-10 text-gray-700">
            CampusFind is a modern lost-and-found platform designed to make it
            easy for students and staff to report, find, and retrieve lost
            belongings around campus. Our mission is to build a connected and
            helpful school community through smart technology.
          </p>
        </div>

        <div
          className="flex flex-col lg:flex-row justify-center gap-16 mt-6"
          data-aos="flip-left"
        >
          {/* Contact */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <div className="flex flex-col items-center gap-2 text-gray-700">
              <div className="flex items-center gap-2">
                <Mail size={18} /> support@campusfind.com
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} /> +63 912 345 6789
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#1a237e] text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} CampusFind. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
