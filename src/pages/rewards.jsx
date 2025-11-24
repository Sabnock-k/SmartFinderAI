import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Gift,
  Award,
  Coffee,
  Car,
  GraduationCap,
  Trophy,
  Star,
  CheckCircle,
  Loader2,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const RewardsPage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [rewardsCatalog, setRewardsCatalog] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [redeemAnimation, setRedeemAnimation] = useState(null);
  const [pointsPulse, setPointsPulse] = useState(false);
  const [activeTab, setActiveTab] = useState("available"); // "available" or "redeemed"

  const [pointsLoading, setPointsLoading] = useState(true);

  // Icon mapping
  const rewardIcons = {
    "Campus Cafeteria Discount": <Coffee className="w-8 h-8" />,
    "Bookstore Discount": <Gift className="w-8 h-8" />,
    "$10 Gift Card": <Award className="w-8 h-8" />,
    "Parking Pass Priority": <Car className="w-8 h-8" />,
    "Extra Credit": <GraduationCap className="w-8 h-8" />,
    "Semester Champion": <Trophy className="w-8 h-8" />,
  };

  const rewardColor = "from-blue-500 to-blue-700";

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Fetch rewards catalog
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/rewards`);
        setRewardsCatalog(res.data);
      } catch (err) {
        console.error("Error fetching rewards catalog:", err);
      }
    };

    const fetchRedeemed = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `${API_BASE}/api/rewards/redeemed-rewards/${user.user_id}`
        );
        setRedeemedRewards(res.data);
      } catch (err) {
        console.error("Error fetching redeemed rewards:", err);
      }
    };

    const fetchUserPoints = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `${API_BASE}/api/rewards/user/${user.user_id}`
        );
        setUserPoints(res.data.points);
      } catch (err) {
        console.error("Error fetching user points:", err);
      } finally {
        setPointsLoading(false);
      }
    };

    Promise.all([fetchRewards(), fetchRedeemed(), fetchUserPoints()]).finally(
      () => setLoading(false)
    );
  }, [user]);

  // Redeem a reward with animation
  const handleRedeem = async (reward) => {
    try {
      await axios.post(`${API_BASE}/api/rewards/redeem`, {
        user_id: user.user_id,
        reward_id: reward.reward_id,
      });

      // Animate card and points
      setRedeemAnimation(reward.reward_id);
      setTimeout(() => setRedeemAnimation(null), 500);
      setPointsPulse(true);
      setTimeout(() => setPointsPulse(false), 500);

      setUserPoints((prev) => prev - reward.points_cost);
      setRedeemedRewards((prev) => [
        ...prev,
        { ...reward, redeemed_at: new Date() },
      ]);
    } catch (err) {
      console.error("Error redeeming reward:", err);
      alert("Failed to redeem reward. Not enough points?");
    }
  };

  const renderAvailableRewards = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewardsCatalog.map((reward) => {
        const isRedeemed = redeemedRewards.some(
          (r) => r.reward_id === reward.reward_id
        );
        const canAfford = userPoints >= reward.points_cost;

        return (
          <div
            key={reward.reward_id}
            className={`bg-white/90 p-6 rounded-xl shadow-lg border border-blue-100 transition-transform duration-300
              ${
                canAfford && !isRedeemed ? "hover:scale-105 cursor-pointer" : ""
              }
              ${redeemAnimation === reward.reward_id ? "animate-bounce" : ""}
            `}
            data-aos="zoom-in"
          >
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${rewardColor} flex items-center justify-center text-white mb-4 shadow-md`}
            >
              {rewardIcons[reward.title] || <Gift />}
            </div>
            <h3 className="text-xl font-bold">{reward.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{reward.points_cost} pts</span>
              </div>

              {isRedeemed ? (
                <div className="flex items-center gap-1 text-green-600 animate-pulse">
                  <CheckCircle className="w-5 h-5" /> Redeemed
                </div>
              ) : canAfford ? (
                <button
                  onClick={() => handleRedeem(reward)}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  Redeem
                </button>
              ) : (
                <span className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500">
                  Locked
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderRedeemedRewards = () =>
    redeemedRewards.length === 0 ? (
      <p className="text-center text-white text-lg">
        You haven't redeemed any rewards yet.
      </p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redeemedRewards.map((reward) => (
          <div
            key={reward.reward_id}
            className="bg-white/90 p-6 rounded-xl shadow-lg border border-blue-100 flex flex-col gap-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h3 className="text-xl font-bold">{reward.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{reward.description}</p>
            <p className="text-gray-700 font-semibold">
              {reward.points_cost} pts
            </p>
            <p className="text-gray-500 text-xs">
              Redeemed on: {new Date(reward.redeemed_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      <Navbar user={user} />

      <main className="flex-1 w-full px-4 py-12 z-10 max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-8" data-aos="fade-down">
          <h1 className="font-black text-5xl md:text-6xl mb-4 drop-shadow-lg tracking-tight">
            Rewards Program
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Earn points by helping others find their lost items!
          </p>
        </header>

        {/* Points Card */}
        <div
          className="bg-white/90 backdrop-blur rounded-2xl p-8 mb-8 shadow-2xl border border-blue-100"
          data-aos="fade-up"
        >
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Points Balance
              </h2>
              <p className="text-gray-600">
                Keep earning to unlock more rewards!
              </p>
            </div>
            <div
              className={`flex items-center gap-4 bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-700 px-8 py-5 rounded-2xl shadow-lg mx-auto md:mx-0 transition-transform duration-300 ${
                pointsPulse ? "scale-110" : "scale-100"
              }`}
            >
              <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
              {pointsLoading ? (
                <Loader2 className="animate-spin text-white w-10 h-10" />
              ) : (
                <div className="text-white">
                  <div className="text-5xl font-black">{userPoints}</div>
                </div>
              )}
            </div>
          </div>
          {/* How to earn points */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
              data-aos="fade-right"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📢</span>
                <div>
                  <p className="font-bold text-blue-900">Report Found Item</p>
                  <p className="text-blue-700 text-sm">
                    Earn <strong>20 points</strong> per item reported
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-green-50 border-l-4 border-green-500 p-4 rounded"
              data-aos="fade-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-bold text-green-900">Successful Return</p>
                  <p className="text-green-700 text-sm">
                    Earn <strong>100 points</strong> when the item is returned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "available"
                ? "bg-blue-600 text-white"
                : "bg-white/30 text-white"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Available Rewards
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === "redeemed"
                ? "bg-green-600 text-white"
                : "bg-white/30 text-white"
            }`}
            onClick={() => setActiveTab("redeemed")}
          >
            Redeemed Rewards
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-white w-12 h-12" />
          </div>
        ) : activeTab === "available" ? (
          renderAvailableRewards()
        ) : (
          renderRedeemedRewards()
        )}
      </main>
    </div>
  );
};

export default RewardsPage;
