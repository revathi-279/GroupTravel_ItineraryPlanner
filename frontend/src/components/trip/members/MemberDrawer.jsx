import { useEffect, useState } from "react";
import { theme } from "../../../common/common";
import { motion } from "framer-motion";
import {
  memberService
}
from "../../../services/memberService";

// Premium vector assets matching our unified luxury minimal identity ✨
import { MoreVertical, ShieldCheck, Map, Wallet, BarChart3, Image, X } from "lucide-react";

const MemberDrawer = ({
  open,
  onClose,
  member,
  trip,
  currentUser,
  mode = "member",
  onMakeAdmin,
  onRemoveAdmin,
  onRemoveMember,
  onInvite,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [
  stats,
  setStats
] = useState(null);

  // Close context dropdown menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".member-menu-container")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Handle Escape shortcut keys
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {

  if (!member || !trip)
    return;

  const loadStats =
    async () => {

      try {

        const response =
          await memberService
            .getMemberStats(
              trip._id,
              member._id
            );

        setStats(
          response.stats
        );

      } catch (error) {

        console.log(error);

      }

    };

  loadStats();

}, [
  member,
  trip
]);

  if (!member) return null;

  const memberIsAdmin = trip?.admins?.some(
    (admin) => admin._id?.toString() === member?._id?.toString()
  );

  const currentUserId = currentUser?.id || currentUser?._id;
  const isInviteMode = mode === "invite";

  const currentUserIsAdmin = trip?.admins?.some(
    (admin) => admin._id?.toString() === currentUserId?.toString()
  );

  return (
    <>
      {/* Smooth Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
      />

      {/* Main Structural Slide Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 220 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FAFAFA] border-l border-gray-200/80 shadow-2xl z-50 flex flex-col font-sans antialiased text-gray-900 overflow-y-auto"
      >
        
        {/* Header Block Component Row */}
        <div className="p-6 bg-white border-b border-gray-200/60 flex items-center justify-between relative member-menu-container">
          <h2 className="text-base font-bold tracking-tight text-gray-900">
            Member Profile
          </h2>

          <div className="flex items-center gap-1.5">
            {currentUserIsAdmin && member._id !== currentUserId && !isInviteMode && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                  aria-label="Manage permissions"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Premium Dropdown Context Operations Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
                    {!memberIsAdmin ? (
                      <button
                        onClick={() => { onMakeAdmin?.(member); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        Promote to Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => { onRemoveAdmin?.(member); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        Demote Admin status
                      </button>
                    )}
                    
                    <div className="border-t border-gray-50 my-1" />
                    
                    <button
                      onClick={() => { onRemoveMember?.(member); setShowMenu(false); }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50/50 transition-colors text-left"
                    >
                      Remove from Journey
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
              aria-label="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Profile Card Body Area */}
        <div className="p-6 space-y-6">
          
          {/* Section 1: User Core Metadata Summary Block */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-xs">
            <div className="relative">
              {member.profilePicture ? (
                <img
                  src={member.profilePicture}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-50 shadow-xs"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#1E4631] text-white flex items-center justify-center text-3xl font-bold ring-4 ring-gray-50 shadow-xs">
                  {member.name?.[0]?.toUpperCase()}
                </div>
              )}
              {memberIsAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-[#1E4631] text-white p-1.5 rounded-full ring-4 ring-white" title="Admin Account">
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>

            <h3 className="mt-4 text-base font-bold text-gray-900 tracking-tight">
              {member.name}
            </h3>
            
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {member.email}
            </p>

            <div className="mt-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                memberIsAdmin ? "bg-[#1E4631]/5 text-[#1E4631]" : "bg-gray-100 text-gray-500"
              }`}>
                {memberIsAdmin ? "Trip Admin" : "Trip Member"}
              </span>
            </div>
          </div>

          {/* Section 2: Detailed Contribution Statistics Grid Metrics Panel */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block pb-2 border-b border-gray-50">
              Journey Engagement activity
            </h4>

            <div className="space-y-3 text-xs font-semibold text-gray-600">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Map size={14} className="text-gray-400" />
                  <span>Itineraries Added</span>
                </div>
                <span className="text-gray-900 font-bold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{stats?.itinerariesAdded ?? "0"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Wallet size={14} className="text-gray-400" />
                  <span>Expenses Filed</span>
                </div>
                <span className="text-gray-900 font-bold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{stats?.expensesFiled ?? "0"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <BarChart3 size={14} className="text-gray-400" />
                  <span>Poll Votes Cast</span>
                </div>
                <span className="text-gray-900 font-bold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{stats?.pollVotesCast ?? "0"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Image size={14} className="text-gray-400" />
                  <span>Photos Contributed</span>
                </div>
                <span className="text-gray-900 font-bold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{stats?.photosContributed ?? "0"}</span>
              </div>
            </div>
          </div>

          {/* Action Button Footer area */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200/70 text-gray-700 text-xs font-bold rounded-xl transition-all active:scale-[0.99]"
            >
              Close Profile View
            </button>
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default MemberDrawer;