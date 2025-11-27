import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import { Loader2, MapPin, Calendar, Tag, ImageOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Items = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reported");

  // Loading states for button actions
  const [founderLoadingId, setFounderLoadingId] = useState(null);
  const [claimerLoadingId, setClaimerLoadingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedIn(true);
      if (storedUser.is_admin) navigate("/admin");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchItems = async () => {
      try {
        const [reportedRes, claimedRes] = await Promise.all([
          axios.get(`${API_BASE}/api/items/${user.user_id}`),
          axios.get(`${API_BASE}/api/items/claimed-items/${user.user_id}`),
        ]);
        setItems(reportedRes.data);
        setClaimedItems(claimedRes.data);
      } catch (err) {
        console.error("Error loading items:", err);
        toast.error("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user]);

  // Founder confirmation
  const handleFounderConfirm = async (itemId) => {
    try {
      setFounderLoadingId(itemId);
      await axios.put(`${API_BASE}/api/claim-item/founder-confirm`, { itemId });
      toast.success("You confirmed returning the item!");
      setItems((prev) =>
        prev.map((i) =>
          i.found_item_id === itemId
            ? { ...i, founder_confirmed: true, status: "founder confirmed" }
            : i
        )
      );
    } catch {
      toast.error("Failed to confirm return.");
    } finally {
      setFounderLoadingId(null);
    }
  };

  // Claimer confirmation
  const handleClaimerConfirm = async (claimId) => {
    try {
      setClaimerLoadingId(claimId);
      await axios.put(`${API_BASE}/api/claim-item/${claimId}/claimer-confirm`);
      toast.success("You confirmed receiving your item!");
      setClaimedItems((prev) =>
        prev.map((i) =>
          i.claim_request_id === claimId
            ? { ...i, claimer_confirmed: true, status: "claimer confirmed" }
            : i
        )
      );
    } catch {
      toast.error("Failed to confirm receipt.");
    } finally {
      setClaimerLoadingId(null);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-lg font-medium">Please login to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      <Navbar user={user} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1
          className="text-white text-6xl font-bold text-center mb-8"
          data-aos="fade-down"
        >
          My Items
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8" data-aos="fade-up">
          <button
            onClick={() => setActiveTab("reported")}
            className={`px-6 py-2 rounded-full font-semibold transition  ${
              activeTab === "reported"
                ? "bg-white text-blue-700 shadow-lg"
                : "bg-blue-900 text-blue-100"
            }`}
          >
            Reported Items
          </button>
          <button
            onClick={() => setActiveTab("claimed")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === "claimed"
                ? "bg-white text-blue-700 shadow-lg"
                : "bg-blue-900 text-blue-100"
            }`}
          >
            Claimed Items
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-white w-12 h-12" />
          </div>
        ) : (
          <>
            {/* Founder / Reported Items */}
            {activeTab === "reported" && (
              <>
                {items.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                      No reported items yet
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Items you report will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.found_item_id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.description}
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="h-48 w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                            <ImageOff className="w-10 h-10 mb-1" />
                            <p className="text-sm">No Image Available</p>
                          </div>
                        )}

                        <div className="p-4 space-y-1">
                          <p className="font-semibold text-gray-800 text-lg">
                            {item.description}
                          </p>
                          {item.category && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Tag size={16} /> {item.category}
                            </p>
                          )}
                          {item.location_description && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin size={16} /> {item.location_description}
                            </p>
                          )}
                          {item.date_time_found && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar size={16} />{" "}
                              {new Date(item.date_time_found).toLocaleString()}
                            </p>
                          )}

                          {item.reunited ? (
                            <p className="text-sm text-green-500">
                              <span className="font-medium text-gray-500">
                                Status:
                              </span>{" "}
                              Reunited
                            </p>
                          ) : item.is_approved &&
                            !item.reunited &&
                            item.status !== "A person is attempting to claim" &&
                            item.status !== "claimer confirmed" &&
                            item.status !== "founder confirmed" ? (
                            <p className="text-sm text-green-500">
                              <span className="font-medium text-gray-500">
                                Status:
                              </span>{" "}
                              Available
                            </p>
                          ) : !item.is_approved && !item.reunited ? (
                            <p className="text-sm text-yellow-500">
                              <span className="font-medium text-gray-500">
                                Status:
                              </span>{" "}
                              Pending Approval
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Status:</span>{" "}
                              {item.status}
                            </p>
                          )}

                          {item.status === "A person is attempting to claim" ||
                          item.status === "claimer confirmed" ? (
                            <button
                              onClick={() =>
                                handleFounderConfirm(item.found_item_id)
                              }
                              className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
                              disabled={founderLoadingId === item.found_item_id}
                            >
                              {founderLoadingId === item.found_item_id ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                              ) : (
                                "Confirm Return"
                              )}
                            </button>
                          ) : item.founder_confirmed ? (
                            <p className="text-green-700 text-sm font-medium text-center mt-2">
                              You have confirmed receipt.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Claimer / Claimed Items */}
            {activeTab === "claimed" && (
              <>
                {claimedItems.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                      No claimed items yet
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Items you claim will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {claimedItems.map((item) => (
                      <div
                        key={item.claim_request_id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.description}
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="h-48 w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                            <ImageOff className="w-10 h-10 mb-1" />
                            <p className="text-sm">No Image Available</p>
                          </div>
                        )}

                        <div className="p-4 space-y-1">
                          <p className="font-semibold text-gray-800 text-lg">
                            {item.description}
                          </p>
                          {item.category && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Tag size={16} /> {item.category}
                            </p>
                          )}
                          {item.location_description && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin size={16} /> {item.location_description}
                            </p>
                          )}
                          {item.date_time_found && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar size={16} />{" "}
                              {new Date(item.date_time_found).toLocaleString()}
                            </p>
                          )}

                          {item.reunited ? (
                            <p className="text-sm text-green-500">
                              <span className="font-medium text-gray-500">
                                Status:
                              </span>{" "}
                              Reunited
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Status:</span>{" "}
                              {item.status}
                            </p>
                          )}

                          {!item.claimer_confirmed ? (
                            <button
                              onClick={() =>
                                handleClaimerConfirm(item.claim_request_id)
                              }
                              className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex justify-center items-center gap-2"
                              disabled={
                                claimerLoadingId === item.claim_request_id
                              }
                            >
                              {claimerLoadingId === item.claim_request_id ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                              ) : (
                                "Confirm Received"
                              )}
                            </button>
                          ) : (
                            <p className="text-green-700 text-sm font-medium text-center mt-2">
                              You have confirmed receipt.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Items;
