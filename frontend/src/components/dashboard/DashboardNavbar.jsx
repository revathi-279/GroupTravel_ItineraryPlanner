import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../common/common";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
import NotificationDrawer from "./NotificationDrawer";

import { settlementService } from "../../services/settlementService";

import { Bell, Compass, LogOut, Settings, User, Trash2, Search, Plus } from "lucide-react";

const DashboardNavbar = ({ search, setSearch, onCreateTrip }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.unreadCount || 0);
      } catch (error) {
        console.log(error);
      }
    };
    loadUnreadCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleAccept = async (notification) => {
    try {
      await notificationService.acceptInvitation(notification._id);
      await loadNotifications();
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count.unreadCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (notification) => {
    try {
      await notificationService.rejectInvitation(notification._id);
      await loadNotifications();
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count.unreadCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettlementConfirm = async (notification) => {
    try {
      console.log("Settlement ID:", notification.settlementId);
      await settlementService.confirmPayment(notification.settlementId);
      await notificationService.markRead(notification._id);
      await loadNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-[#EFE9DC] sticky top-0 z-50 font-sans antialiased">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Premium Brand Identity */}
        <div 
          onClick={() => navigate("/dashboard")} 
          className="flex items-center gap-2.5 cursor-pointer select-none flex-shrink-0"
        >
          <div className="p-2 bg-[#2D6A4F]/10 rounded-xl text-[#2D6A4F]">
            <Compass size={18} />
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight hidden sm:block">
            Trip<span className="text-[#2D6A4F] font-semibold">Crew</span>
          </h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search journeys, destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm transition-all duration-200 outline-none placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] text-slate-800"
          />
        </div>

        {/* Right: Core Action Utilities */}
        <div ref={dropdownRef} className="flex items-center gap-3 flex-shrink-0 relative">
          
          {/* Global CTA Action Button */}
          <button
            onClick={onCreateTrip}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Create Journey</span>
          </button>

          <div className="h-4 w-[1px] bg-[#EFE9DC] mx-1 hidden sm:block" />

          {/* Functional Notification Bell */}
          <button
            onClick={() => {
              setShowNotifications(true);
              loadNotifications();
            }}
            className="relative p-2 text-stone-400 hover:text-slate-700 hover:bg-stone-50 rounded-xl transition-all active:scale-95"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[8px] font-black min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Account Avatar Trigger */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#EFE9DC] hover:border-[#2D6A4F] transition-all flex-shrink-0"
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#2D6A4F] text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </button>

          {/* Context Dropdown Box Menu */}
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-[#EFE9DC] shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
              <div className="px-4 py-2.5 border-b border-[#F5F0E6] mb-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-0.5">Account</p>
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Traveler"}</p>
                <p className="text-xs text-stone-400 truncate">{user?.email || "traveler@tripcrew.com"}</p>
              </div>

              <button
                onClick={() => { setOpen(false); navigate("/profile"); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-[#FAF8F5] transition-colors text-left"
              >
                <User size={14} className="text-stone-400" /> Profile
              </button>

              <button
                onClick={() => { setOpen(false); navigate("/settings"); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-[#FAF8F5] transition-colors text-left"
              >
                <Settings size={14} className="text-stone-400" /> Settings
              </button>

              <div className="border-t border-[#F5F0E6] my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
              >
                <LogOut size={14} /> Logout
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-1.5 text-[10px] text-stone-400 hover:text-rose-500 transition-colors text-left"
              >
                <Trash2 size={12} /> Delete Account
              </button>
            </div>
          )}

        </div>
      </div>

      <NotificationDrawer
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        onConfirmSettlement={handleSettlementConfirm}
        notifications={notifications}
        loading={loadingNotifications}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </nav>
  );
};

export default DashboardNavbar;