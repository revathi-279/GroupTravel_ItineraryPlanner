import { useEffect } from "react";
import { motion } from "framer-motion";
import { theme } from "../../../common/common";

// Premium minimalistic vectors matching our unified design identity ✨
import { X, MapPin, Clock, User, History, Edit2, Trash2, AlignLeft } from "lucide-react";

const EventDrawer = ({
  itinerary,
  trip,
  currentUser,
  onClose,
  onEdit,
  onDelete,
}) => {
  // Handle Escape key closure shortcut safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!itinerary) return null;

  const currentUserId = currentUser?.id || currentUser?._id;
  const currentUserIsAdmin = trip?.admins?.some(
    (admin) => admin._id?.toString() === currentUserId?.toString()
  );

  const wasUpdated =
    new Date(itinerary.updatedAt).getTime() - new Date(itinerary.createdAt).getTime() > 1000;

  const formattedDateTime = new Date(itinerary.dateTime).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

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
        className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FAFAFA] border-l border-gray-200/80 shadow-2xl z-50 flex flex-col font-sans antialiased text-gray-900"
      >
        
        {/* Header Section */}
        <div className="p-6 bg-white border-b border-gray-200/60 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-gray-900">
            Event Overview
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Main Title & Status Badge Block */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold tracking-tight text-gray-900 leading-snug">
                {itinerary.title}
              </h3>
              {itinerary.status && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E4631]/5 text-[#1E4631] px-2.5 py-1 rounded-md flex-shrink-0">
                  {itinerary.status}
                </span>
              )}
            </div>

            <div className="pt-2 space-y-2 text-xs font-semibold text-gray-600 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{itinerary.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} className="text-gray-400 flex-shrink-0" />
                <span>{formattedDateTime}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <AlignLeft size={13} /> Description
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {itinerary.description || "No description provided for this timeline event."}
            </p>
          </div>

          {/* Creator Information & Historical Log Cards */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Created By Metadata */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden flex-shrink-0">
                {itinerary.createdBy?.profilePicture ? (
                  <img src={itinerary.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    {itinerary.createdBy?.name?.[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1">
                  Created By
                </p>
                <p className="text-xs font-bold text-gray-800 leading-none">
                  {itinerary.createdBy?.name || "Group Traveler"}
                </p>
              </div>
            </div>

            {/* Timestamps Logs */}
            <div className="pt-3 border-t border-gray-50 grid grid-cols-2 gap-4 text-[11px] font-semibold text-gray-500">
              <div className="space-y-1">
                <p className="text-gray-400 font-medium flex items-center gap-1">
                  <History size={12} /> Published
                </p>
                <p className="text-gray-700 font-bold">
                  {new Date(itinerary.createdAt).toLocaleDateString()}
                </p>
              </div>

              {wasUpdated && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <p className="text-gray-400 font-medium flex items-center gap-1">
                    <History size={12} /> Last Modified
                  </p>
                  <p className="text-gray-700 font-bold">
                    {new Date(itinerary.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Admin Configuration Actions Drawer Footer */}
        {currentUserIsAdmin && (
          <div className="p-6 bg-white border-t border-gray-200/60 space-y-2.5">
            <button
              onClick={() => onEdit?.(itinerary)}
              className="w-full flex items-center justify-center gap-1.5 bg-[#1E4631] hover:bg-[#153122] text-white py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all duration-150 active:scale-[0.99]"
            >
              <Edit2 size={13} />
              <span>Edit Event Details</span>
            </button>
            <button
              onClick={() => onDelete?.(itinerary)}
              className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 active:scale-[0.99]"
            >
              <Trash2 size={13} />
              <span>Delete Event Milestone</span>
            </button>
          </div>
        )}

      </motion.div>
    </>
  );
};

export default EventDrawer;