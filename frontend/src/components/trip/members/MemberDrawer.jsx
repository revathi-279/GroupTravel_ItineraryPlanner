import { useEffect, useState } from "react";
import { theme } from "../../../common/common";
import { motion, AnimatePresence } from "framer-motion";
import { memberService } from "../../../services/memberService";

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
  const [stats, setStats] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".member-menu-container")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isImageExpanded) {
          setIsImageExpanded(false);
        } else {
          onClose();
        }
      }
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose, isImageExpanded]);

  useEffect(() => {
    if (!member || !trip) return;

    const loadStats = async () => {
      try {
        const response = await memberService.getMemberStats(trip._id, member._id);
        setStats(response.stats);
      } catch (error) {
        console.log(error);
      }
    };

    loadStats();
  }, [member, trip]);

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
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40"
      />

      {/* Main Structural Slide Drawer Panel - Removed overflow-y-auto to lock scroll */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 220 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white border-l border-[#EFE9DC] shadow-2xl z-50 flex flex-col font-sans antialiased text-slate-900 overflow-hidden"
      >
        
        {/* Header Block Component Row */}
        <div className="p-6 bg-white border-b border-[#F5F0E6] flex items-center justify-between relative member-menu-container flex-shrink-0">
          <h2 className="text-base font-bold tracking-tight text-slate-800">
            Member Profile
          </h2>

          <div className="flex items-center gap-1.5">
            {currentUserIsAdmin && member._id !== currentUserId && !isInviteMode && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-xl text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all active:scale-95"
                  aria-label="Manage permissions"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown Options Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#EFE9DC] rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
                    {!memberIsAdmin ? (
                      <button
                        onClick={() => { onMakeAdmin?.(member); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition-colors text-left"
                      >
                        Promote to Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => { onRemoveAdmin?.(member); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition-colors text-left"
                      >
                        Demote Admin status
                      </button>
                    )}
                    
                    <div className="border-t border-[#F5F0E6] my-1" />
                    
                    <button
                      onClick={() => { onRemoveMember?.(member); setShowMenu(false); }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
                    >
                      Remove from Journey
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
              aria-label="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Profile Card Body Area */}
        <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col justify-center">
          
          {/* Section 1: User Core Metadata Summary Block */}
          <div className="bg-[#FAF8F5] border border-[#EFE9DC] rounded-3xl p-6 flex flex-col items-center text-center shadow-xs">
            <div className="relative">
              <button 
                onClick={() => setIsImageExpanded(true)}
                className="relative block focus:outline-none transition-transform hover:scale-105 active:scale-95"
              >
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xs"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white shadow-xs">
                    {member.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </button>
              
              {memberIsAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-[#2D6A4F] text-white p-1.5 rounded-full ring-4 ring-white" title="Admin Account">
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800 tracking-tight">
              {member.name}
            </h3>
            
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              {member.email}
            </p>

            <div className="mt-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                memberIsAdmin ? "bg-[#E9F5ED] text-[#2D6A4F]" : "bg-stone-100 text-stone-500"
              }`}>
                {memberIsAdmin ? "Trip Admin" : "Trip Member"}
              </span>
            </div>
          </div>

          {/* Section 2: Detailed Contribution Statistics Grid Metrics Panel */}
          <div className="bg-white border border-[#EFE9DC] rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block pb-2 border-b border-[#F5F0E6]">
              Journey Engagement activity
            </h4>

            <div className="space-y-3 text-xs font-semibold text-stone-600">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-stone-500">
                  <Map size={14} className="text-stone-400" />
                  <span>Itineraries Added</span>
                </div>
                <span className="text-slate-800 font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EFE9DC]">{stats?.itinerariesAdded ?? "0"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-stone-500">
                  <Wallet size={14} className="text-stone-400" />
                  <span>Expenses Filed</span>
                </div>
                <span className="text-slate-800 font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EFE9DC]">{stats?.expensesFiled ?? "0"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-stone-500">
                  <BarChart3 size={14} className="text-stone-400" />
                  <span>Poll Votes Cast</span>
                </div>
                <span className="text-slate-800 font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EFE9DC]">{stats?.pollVotesCast ?? "0"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 text-stone-500">
                  <Image size={14} className="text-stone-400" />
                  <span>Photos Contributed</span>
                </div>
                <span className="text-slate-800 font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EFE9DC]">{stats?.photosContributed ?? "0"}</span>
              </div>
            </div>
          </div>

          {/* Action Button Footer area removed entirely as requested */}

        </div>
      </motion.div>

      {/* WhatsApp Style Fullscreen Profile View Overlay */}
      <AnimatePresence>
        {isImageExpanded && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImageExpanded(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-sm w-full bg-transparent flex flex-col items-center justify-center z-10"
            >
              {/* Top-Right Cross Close Mark for Profile Pic View */}
              <button 
                onClick={() => setIsImageExpanded(false)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
                aria-label="Close layout screen view"
              >
                <X size={20} />
              </button>

              <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0">
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-full h-full object-cover select-none"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2D6A4F] text-white flex items-center justify-center text-7xl font-bold select-none">
                    {member.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MemberDrawer;