import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { theme } from "../../../common/common";
import { itineraryService } from "../../../services/itineraryService";

// Premium minimalistic vectors matching our unified design identity ✨
import {
  X,
  MapPin,
  Clock,
  History,
  Edit2,
  Trash2,
  AlignLeft,
  MoreVertical,
  Check,
  AlertTriangle
} from "lucide-react";

const EventDrawer = ({
  itinerary,
  trip,
  currentUser,
  onClose,
  onEdit,
  onDelete,
  onStatusUpdated,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // Handle Escape key closure shortcut safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest(".event-menu-container")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!itinerary) return null;

  const currentUserId = currentUser?.id || currentUser?._id;
  const currentUserIsAdmin = trip?.admins?.some((admin) => {
    const adminId = admin?._id || admin;
    return String(adminId) === String(currentUserId);
  });

  const updateStatus = async (newStatus) => {
    try {
      setStatusLoading(true);
      await itineraryService.updateItinerary({
        itineraryId: itinerary._id,
        status: newStatus,
      });

      await onStatusUpdated?.();
      itinerary.status = newStatus;
    } catch (error) {
      console.log(error);
    } finally {
      setStatusLoading(false);
    }
  };

  const now = new Date();
  const eventDate = new Date(itinerary.dateTime);

  const isCompleted = itinerary.status === "Completed";
  const isCancelled = itinerary.status === "Cancelled";
  const isOngoing = itinerary.status === "Upcoming" && eventDate <= now;
  const needsReview = itinerary.needsReview;
  const canUpdateStatus = itinerary.status === "Upcoming" && (isOngoing || needsReview);

  const wasUpdated = new Date(itinerary.updatedAt).getTime() - new Date(itinerary.createdAt).getTime() > 1000;

  const formattedDateTime = new Date(itinerary.dateTime).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return createPortal(
    <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
      
      {/* 1. Backdrop layer protecting color temperature warmth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full cursor-pointer"
      />

      {/* 2. Main Slide Drawer Sheet Panel Canvas - Pure White Base */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[440px] bg-white border-l border-[#EFE9DC] shadow-2xl z-10 flex flex-col overflow-hidden"
      >
        
        {/* Header Section Row */}
        <div className="p-6 bg-white border-b border-[#F5F0E6] flex items-center justify-between event-menu-container select-none flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Event Overview
          </h2>

          <div className="flex items-center gap-1.5">
            {currentUserIsAdmin && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#EFE9DC] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit?.(itinerary);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-stone-600 hover:bg-[#FAF8F5] hover:text-[#2D6A4F] flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={13} />
                      Edit Event
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete?.(itinerary);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-[#FAF8F5]"
                    >
                      <Trash2 size={13} />
                      Delete Event
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Core Meta Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white scrollbar-thin">
          
          {/* Box Block 1: Destination Title & Status Badge Capsule */}
          <div className="bg-[#FAF8F5] border border-[#EFE9DC]/60 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                {itinerary.title}
              </h3>
              
              {itinerary.status && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                  isCompleted ? "bg-[#E9F5ED] border-[#C1E2CE] text-[#2D6A4F]" :
                  isCancelled ? "bg-rose-50 border-rose-100 text-rose-600" :
                  "bg-stone-100 border-stone-200/40 text-stone-400"
                }`}>
                  {itinerary.status}
                </span>
              )}
            </div>

            <div className="pt-3.5 space-y-2.5 text-xs font-semibold text-stone-500 border-t border-[#EFE9DC]/30 select-none">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[#2D6A4F] flex-shrink-0" />
                <span className="text-slate-700 truncate">{itinerary.location}</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-stone-400 flex-shrink-0" />
                <span className="text-slate-700">{formattedDateTime}</span>
              </div>
            </div>
          </div>

          {/* Box Block 2: Narrative Text Notes Description Container */}
          <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
              <AlignLeft size={13} /> Description
            </h4>
            <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
              {itinerary.description || "No specific itinerary notes or descriptions provided for this stop."}
            </p>
          </div>

          {/* Box Block 3: Context Administrative State Updates */}
          {currentUserIsAdmin && (
            <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs select-none space-y-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Event Status Action
              </h4>

              {needsReview && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <p className="leading-none mb-1">Passed Milestone Alert</p>
                    <p className="text-[11px] text-amber-600 font-medium leading-tight">
                      This event scheduled time window has elapsed. Please audit and update the status log.
                    </p>
                  </div>
                </div>
              )}

              {canUpdateStatus && (
                <div className="flex gap-2.5 pt-1">
                  <button
                    disabled={statusLoading}
                    onClick={() => updateStatus("Completed")}
                    className="flex-1 py-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    Mark Completed
                  </button>

                  <button
                    disabled={statusLoading}
                    onClick={() => updateStatus("Cancelled")}
                    className="flex-1 py-2 bg-white hover:bg-rose-50 border border-[#EFE9DC] text-stone-500 hover:text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    Cancel Stop
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="p-3 rounded-xl bg-[#E9F5ED] border border-[#C1E2CE] text-[#2D6A4F] text-xs font-semibold flex items-center gap-2">
                  <Check size={14} strokeWidth={3} />
                  <span>This itinerary event milestone has been completed.</span>
                </div>
              )}

              {isCancelled && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2">
                  <X size={14} strokeWidth={3} />
                  <span>This planned itinerary event route was cancelled.</span>
                </div>
              )}
            </div>
          )}

          {/* Box Block 4: Context Author Logs Records History Tracker */}
          <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 select-none">
              <div className="w-8 h-8 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0">
                {itinerary.createdBy?.profilePicture ? (
                  <img src={itinerary.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold uppercase text-stone-400">
                    {itinerary.createdBy?.name?.[0] || "T"}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none mb-1">
                  Published By
                </p>
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {itinerary.createdBy?.name || "Group Member"}
                </p>
              </div>
            </div>

            {/* Micro Metadata Timestamp Streams */}
            <div className="pt-3.5 border-t border-[#FAF8F5] grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 select-none">
              <div className="space-y-1">
                <p className="font-semibold flex items-center gap-1 text-stone-400 normal-case">
                  <History size={12} className="text-stone-300" /> Created Log
                </p>
                <p className="text-slate-700 font-extrabold">
                  {new Date(itinerary.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              {wasUpdated && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <p className="font-semibold flex items-center gap-1 text-stone-400 normal-case">
                    <History size={12} className="text-stone-300" /> Last Modified
                  </p>
                  <p className="text-slate-700 font-extrabold">
                    {new Date(itinerary.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              )}
            </div>
          </div>

        </div>

      </motion.div>
    </div>,
    document.body
  );
};

export default EventDrawer;