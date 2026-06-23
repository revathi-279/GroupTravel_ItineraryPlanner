import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Wallet,
  Images,
  BarChart3,
  ChevronLeft,
  Users,
  Calendar,
  MapPin,
  Clock3
} from "lucide-react";

const TripSidebar = ({
  trip,
  statistics,
  activeTab,
  setActiveTab,
  currentUser,
}) => {
  const navigate = useNavigate();
  
  const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Itinerary", icon: Map },
    { label: "Expenses", icon: Wallet },
    { label: "Gallery", icon: Images },
    { label: "Polls", icon: BarChart3 },
  ];

  const startDate = trip?.startDate ? new Date(trip.startDate).toLocaleDateString() : "";
  const endDate = trip?.endDate ? new Date(trip.endDate).toLocaleDateString() : "";

  return (
    <aside className="w-[320px] h-screen bg-white border-r border-[#EFE9DC] flex flex-col justify-between shadow-xs font-sans antialiased text-slate-900 select-none flex-shrink-0">
      
      {/* Top Header & Navigation Links */}
      <div className="flex flex-col">
        <div className="p-4 border-b border-[#F5F0E6]">
          <Link
            to="/dashboard"
            onClick={() => {
              localStorage.removeItem(`tripActiveTab_${trip?._id}`);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-stone-400 rounded-xl hover:bg-[#FAF8F5] hover:text-slate-800 transition-all duration-200 group"
          >
            <ChevronLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform text-stone-400 group-hover:text-slate-800" />
            Back to Dashboard
          </Link>
        </div>

        {/* Premium Trip Card Summary Container */}
        <div className="m-4 p-5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-3xl shadow-2xs">
          <h2 className="text-base font-bold text-slate-800 tracking-tight leading-snug truncate">
            {trip?.title || "Untitled Trip"}
          </h2>
          
          <div className="mt-4 space-y-3 text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-[#2D6A4F] flex-shrink-0" />
              <span className="text-slate-700 truncate">{trip?.destination || "No destination specified"}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar size={14} className="text-stone-400 flex-shrink-0" />
              <span className="text-slate-700">{startDate && endDate ? `${startDate} — ${endDate}` : "Dates pending"}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Users size={14} className="text-stone-400 flex-shrink-0" />
              <span className="text-slate-700">{trip?.members?.length || 0} Members</span>
            </div>

            <div className="flex items-center gap-2.5 pt-0.5">
              <Clock3 size={14} className="text-stone-400 flex-shrink-0" />
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white border border-[#EFE9DC] text-[#2D6A4F]">
                {statistics?.tripStatus || "Planning"}
              </span>
            </div>
          </div>
        </div>

        {/* Active Route Links Navigation Container Stack */}
        <nav className="px-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/10 font-bold"
                    : "text-stone-400 hover:bg-[#FAF8F5] hover:text-slate-800"
                }`}
              >
                <Icon size={15} className={isActive ? "text-white" : "text-stone-400 group-hover:text-stone-600"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Modern Profile Identity Footer Control Card */}
      <div className="border-t border-[#F5F0E6] p-4 bg-[#FAF8F5]/50">
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-[#EFE9DC] transition-all duration-200 text-left group"
        >
          <div className="relative flex-shrink-0">
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-[#EFE9DC]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs uppercase">
                {currentUser?.name?.[0] || "U"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">
              {currentUser?.name || "Guest Traveler"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-[#2D6A4F] transition-colors leading-none">
              View Profile
            </p>
          </div>
        </button>
      </div>

    </aside>
  );
};

export default TripSidebar;