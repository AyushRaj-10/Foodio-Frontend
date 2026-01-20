import React, { useContext, useEffect, useState } from "react";
import { ShoppingCart, MapPin, Percent, User, Home } from "lucide-react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const statCards = [
  { title: "Active Orders", value: "12", icon: ShoppingCart, accent: "from-orange-500 to-red-500" },
  { title: "On the Way", value: "5", icon: MapPin, accent: "from-indigo-500 to-purple-500" },
  { title: "Offers Used", value: "18", icon: Percent, accent: "from-emerald-500 to-green-500" },
  { title: "Loyalty Points", value: "1,240", icon: User, accent: "from-amber-500 to-yellow-500" },
];

const Dashboard = () => {
  const { userInfo, addressInfo, addresses, user } = useContext(AppContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await userInfo();
        if (res?.user) setProfile(res.user);
        await addressInfo();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-16">
      <div className="max-w-6xl mx-auto text-white">
        <div className="mb-10">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
            Foodio Pulse
          </p>
          <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            Dashboard
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Track your orders, rewards, and activity in one sleek view.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl p-5"
            >
              <div
                className={`absolute inset-0 opacity-30 bg-gradient-to-br ${card.accent}`}
              />
              <div className="relative flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-white/70">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Profile</h2>
              <span className="text-sm text-white/70">
                {loading ? "Loading..." : "Up to date"}
              </span>
            </div>
            <div className="space-y-3 text-white/90">
              <p className="text-xl font-semibold">
                {profile?.name || user?.name || "—"}
              </p>
              <p className="text-sm text-white/70">
                {profile?.email || user?.email || "—"}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => navigate("/address")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg"
                >
                  Manage Addresses
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Home className="h-6 w-6" />
              <h2 className="text-xl font-bold">Addresses</h2>
            </div>
            <div className="space-y-3 max-h-72 overflow-auto pr-1">
              {(addresses || []).length === 0 && (
                <p className="text-sm text-white/70">No addresses saved yet.</p>
              )}
              {(addresses || []).map((addr) => (
                <div
                  key={addr._id || `${addr.street}-${addr.city}`}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <p className="font-semibold">{addr.label || "Address"}</p>
                  <p className="text-sm text-white/70">
                    {addr.street}, {addr.city}, {addr.state} {addr.zip}
                  </p>
                  {addr.phone && (
                    <p className="text-sm text-white/60 mt-1">Ph: {addr.phone}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/address")}
              className="mt-4 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold"
            >
              Add / Update Address
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;