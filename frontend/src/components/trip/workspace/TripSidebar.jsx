import React from "react";
import { Link } from "react-router-dom";
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
  Clock3,
  UserCircle2
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const TripSidebar = ({
  trip,
  statistics,
  activeTab,
  setActiveTab,
  currentUser, // Added as a prop to prevent undefined errors
     // Added as a prop for the profile button action
}) => {

  const navigate =
  useNavigate();
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
    <aside className="w-[320px] h-screen bg-white border-r border-gray-200/80 flex flex-col justify-between shadow-sm font-sans antialiased">
      
      {/* Top Header Section */}
      <div className="flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Link
  to="/dashboard"
  onClick={() => {

    localStorage.removeItem(
      `tripActiveTab_${trip._id}`
    );

  }}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
          >
            <ChevronLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Trip Info Card */}
        <div className="m-4 p-5 bg-gradient-to-br from-[#F4F7F5] to-[#EBF2EE] rounded-2xl border border-[#E2EAE5] shadow-xs">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-snug">
            {trip?.title || "Untitled Trip"}
          </h2>
          
          <div className="mt-4 space-y-3 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="text-[#2F6F4E]" />
              <span className="truncate">{trip?.destination}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar size={15} className="text-gray-400" />
              <span>{startDate} — {endDate}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Users size={15} className="text-gray-400" />
             <span>
  {trip?.members?.length || 0} Members
</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock3 size={15} className="text-gray-400" />
              <span className="capitalize px-2 py-0.5 rounded-full bg-white/80 border border-gray-200/50 text-[10px] font-bold text-gray-700">
                {statistics?.tripStatus || "Planning"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#2F6F4E] text-white shadow-md shadow-[#2F6F4E]/10 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer Section */}
      <div className="border-t border-gray-100 p-4 bg-gray-50/50">
        <button
         onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-200 text-left group"
        >
          <div className="relative flex-shrink-0">
            {currentUser?.profilePicture ? (

  <img
    src={currentUser.profilePicture}
    alt=""
    className="
    w-10
    h-10
    rounded-full
    object-cover
    "
  />

) : (

  <div
    className="
    w-10
    h-10
    rounded-full
    bg-[#2F6F4E]
    text-white
    flex
    items-center
    justify-center
    font-semibold
    "
  >
    {currentUser?.name?.[0]}
  </div>

)}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate leading-none mb-1">
              {currentUser?.name || "Guest Traveler"}
            </p>
            <p className="text-xs font-medium text-gray-400 group-hover:text-[#2F6F4E] transition-colors leading-none">
              View Profile
            </p>
          </div>
        </button>
      </div>

    </aside>
  );
};

export default TripSidebar;