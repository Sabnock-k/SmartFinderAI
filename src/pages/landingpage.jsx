import React, { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Search,
  Sparkles,
  Bell,
  Menu,
  X,
} from "lucide-react";
// Do not import AOS here, we will load it dynamically
import AOS from "aos";
import "aos/dist/aos.css";

// Features Card Component
const FeatureCard = ({ icon, title, description, aosAnimation }) => (
  <div
    className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg transform transition-transform hover:scale-105"
    data-aos={aosAnimation}
  >
    <div className="p-4 bg-indigo-100 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-indigo-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Main App Component (Landing Page)
const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // index to cycle through images
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prevIndex) => (prevIndex + 1) % cfactionimg.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  // Images for the About section
  const cfactionimg = ["cfaction.png", "cfaction2.png"];

  return (
    <div className="w-full h-full scroll-smooth bg-gray-50">
      {/* --- HEADER / NAVBAR --- */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="CampusFind Logo"
              className="w-20 h-auto"
            />
            <span className="text-2xl font-bold text-indigo-900">
              CampusFind
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/login"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute m-0 bg-white w-full flex flex-col items-center px-6 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium text-lg"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/login"
              className="w-full text-center px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              Login
            </a>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
        {/* Subtle background icons */}
        <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
          <Search className="absolute top-1/4 left-1/4 w-24 h-24 text-white -rotate-12" />
          <Bell className="absolute top-1/2 right-1/4 w-20 h-20 text-white rotate-6" />
          <Sparkles className="absolute bottom-1/4 left-2/3 w-16 h-16 text-white" />
          <svg
            className="absolute top-0 left-0 w-64 h-64 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.1}
              d="M12 18h.01M6 12h.01M18 12h.01M6 6h.01M12 6h.01M18 6h.01M12 12h.01"
            />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center w-full px-8 lg:px-20 py-20">
          <div data-aos="zoom-in" data-aos-delay="100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              Lost something? Don't panic.
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Our AI-powered platform helps reconnect you with your lost items,
              faster and smarter.
            </p>
            <div className="p-6">
              <a
                href="/login" // This would be your /login or /register route
                className="mt-10 inline-block px-10 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-xl hover:bg-indigo-100 transform transition-transform hover:scale-105"
              >
                Start Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 lg:py-28 bg-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-indigo-900 mb-4">
              How CampusFind Works
            </h2>
            <p className="text-lg text-gray-700 max-w-xl mx-auto">
              A simple, smart, and speedy way to handle lost and found.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search size={32} className="text-indigo-600" />}
              title="1. Report Lost or Found"
              description="Quickly submit a detailed report for any item you've lost or found. Add photos, location, and key details."
              aosAnimation="fade-up"
            />
            <FeatureCard
              icon={<Sparkles size={32} className="text-indigo-600" />}
              title="2. AI-Powered Matching"
              description="Search and let our smart AI get to work, instantly compare the description of your lost item against the entire database to find potential matches."
              aosAnimation="fade-up"
              data-aos-delay="200"
            />
            <FeatureCard
              icon={<Bell size={32} className="text-indigo-600" />}
              title="3. Get Notified"
              description="Receive instant notifications when a likely match is found, so you can connect and coordinate a speedy return."
              aosAnimation="fade-up"
              data-aos-delay="400"
            />
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 overflow-x-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image */}
            <div className="lg:w-1/2" data-aos="fade-right">
              <img
                src={cfactionimg[imgIndex]}
                alt="Illustration of returning an item"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
            {/* Text Content */}
            <div className="lg:w-1/2" data-aos="fade-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-indigo-900 mb-6">
                About CampusFind
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                CampusFind is a modern lost-and-found platform designed to make
                it easy for students and staff to report, find, and retrieve
                lost belongings around campus.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to build a connected and helpful school community
                through smart technology. We believe that losing an item
                shouldn't be a stressful experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT/FOOTER SECTION --- */}
      <footer id="contact" className="bg-[#1a237e] text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* About/Logo */}
            <div className="md:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.png"
                  alt="CampusFind Logo"
                  className="w-12 h-auto"
                />
                <span className="text-2xl font-bold text-white">
                  CampusFind
                </span>
              </a>
              <p className="text-indigo-100/80">
                Reuniting communities, one found item at a time.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@campusfind.com"
                  className="flex items-center gap-3 hover:text-indigo-200 transition-colors"
                >
                  <Mail size={20} /> support@campusfind.com
                </a>
                <a
                  href="tel:+639123456789"
                  className="flex items-center gap-3 hover:text-indigo-200 transition-colors"
                >
                  <Phone size={20} /> +63 912 345 6789
                </a>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-indigo-500 rounded-full hover:bg-indigo-400 transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-indigo-500 rounded-full hover:bg-indigo-400 transition-colors"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-indigo-500/30 pt-8 text-center text-indigo-100/80">
            © {new Date().getFullYear()} CampusFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
