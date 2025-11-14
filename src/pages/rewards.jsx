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
  TrendingUp,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const RewardsPage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [userPoints, setUserPoints] = useState(250);
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const rewards = [
    {
      id: 1,
      icon: <Coffee className="w-8 h-8" />,
      title: "Campus Cafeteria Discount",
      description: "10% off on all purchases",
      points: 100,
      color: "from-orange-400 to-red-500",
    },
    {
      id: 2,
      icon: <Gift className="w-8 h-8" />,
      title: "Bookstore Discount",
      description: "10% off on books & supplies",
      points: 100,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 3,
      icon: <Award className="w-8 h-8" />,
      title: "$10 Gift Card",
      description: "Monthly raffle entry",
      points: 200,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 4,
      icon: <Car className="w-8 h-8" />,
      title: "Parking Pass Priority",
      description: "Priority in parking allocation",
      points: 300,
      color: "from-green-400 to-green-600",
    },
    {
      id: 5,
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Extra Credit",
      description: "Bonus points in participating courses",
      points: 400,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: 6,
      icon: <Trophy className="w-8 h-8" />,
      title: "Semester Champion",
      description: "Recognition & special certificate",
      points: 600,
      color: "from-pink-400 to-rose-600",
    },
  ];

  const handleRedeem = (reward) => {
    if (userPoints >= reward.points && !redeemedRewards.includes(reward.id)) {
      setUserPoints((prev) => prev - reward.points);
      setRedeemedRewards([...redeemedRewards, reward.id]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] relative overflow-hidden">
      {/* Background pattern: unchanged */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 border-2 border-white rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white rounded-lg rotate-12"></div>
      </div>

      {/* Navbar */}
      <Navbar user={user} />

      {/* Main content */}
      <main className="flex-1 w-full px-4 py-12 z-10">
        <div className="max-w-6xl mx-auto">
          <header className="text-center text-white mb-12" data-aos="fade-down">
            <h1 className="font-black text-5xl md:text-6xl mb-4 drop-shadow-lg tracking-tight">
              Rewards Program
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Earn points by helping others find their lost items!
            </p>
          </header>

          {/* Points Display Card */}
          <div
            className="bg-white/90 backdrop-blur rounded-2xl p-8 mb-8 shadow-2xl border border-blue-100"
            data-aos="fade-up"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Your Points Balance
                </h2>
                <p className="text-gray-600">
                  Keep earning to unlock more rewards!
                </p>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-700 px-8 py-5 rounded-2xl shadow-lg">
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                <div className="text-white">
                  <div className="text-5xl font-black">{userPoints}</div>
                  <div className="text-sm opacity-90">Total Points</div>
                </div>
              </div>
            </div>
            {/* How to Earn Points */}
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
                    <p className="font-bold text-green-900">
                      Successful Return
                    </p>
                    <p className="text-green-700 text-sm">
                      Earn <strong>50 points</strong> when owner confirms
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-white mb-6 text-center"
              data-aos="fade-up"
            >
              Available Rewards
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canAfford = userPoints >= reward.points;
                const isRedeemed = redeemedRewards.includes(reward.id);

                return (
                  <div
                    key={reward.id}
                    className={`bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg transition-all duration-300 border border-blue-100 ${
                      canAfford && !isRedeemed
                        ? "hover:scale-105 cursor-pointer"
                        : ""
                    } ${!canAfford ? "opacity-60" : ""}`}
                    data-aos="zoom-in"
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${reward.color} flex items-center justify-center text-white mb-4 shadow-md`}
                    >
                      {reward.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {reward.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold text-gray-700">
                          {reward.points} pts
                        </span>
                      </div>
                      {isRedeemed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-semibold">
                            Redeemed
                          </span>
                        </div>
                      ) : canAfford ? (
                        <button
                          onClick={() => handleRedeem(reward)}
                          className={`px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r ${reward.color} hover:opacity-90 transition-opacity shadow-md`}
                        >
                          Redeem
                        </button>
                      ) : (
                        <span className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demo Button */}
          <div className="text-center mb-8" data-aos="fade-up">
            <button
              onClick={() => setUserPoints((prev) => prev + 50)}
              className="bg-white/90 backdrop-blur text-blue-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-blue-200"
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Simulate Earning Points (+50)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RewardsPage;
