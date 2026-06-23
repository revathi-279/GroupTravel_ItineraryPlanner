import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ActivityDrawer = ({
  open,
  onClose,
  updates,
  currentUser
}) => {

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 min ago";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours === 1) return "1 hr ago";
    if (hours < 24) return `${hours} hr ago`;
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const getMessage = (update) => {
    const isCurrentUser = update.user?._id?.toString() === currentUser?._id?.toString();
    const actor = isCurrentUser ? "You" : update.user?.name;

    switch (update.type) {
      case "gallery_uploaded":
        return `${actor} uploaded a photo`;
      case "expense_added":
      case "expense_settled":
      case "itinerary_status_updated":
        return update.message.replace(update.user?.name, actor);
      case "poll_created":
        return `${actor} created a poll`;
      case "member_joined":
        return `${actor} joined the trip`;
      case "member_left":
        return `${actor} left the trip`;
      case "itinerary_added":
        return `${actor} added an itinerary event`;
      case "itinerary_updated":
        return `${actor} updated an itinerary event`;
      case "itinerary_deleted":
        return `${actor} deleted an itinerary event`;
      default:
        return update.message;
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
          
          {/* 1. Animated Dimmed Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full cursor-pointer"
          />

          {/* 2. Animated Sliding Sheet Canvas Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[420px] bg-white border-l border-[#EFE9DC] shadow-2xl z-10 flex flex-col overflow-hidden"
          >
            
            {/* Header Block Section */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5F0E6] bg-white select-none flex-shrink-0">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                Activity Timeline
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Core Scroll View Timeline List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white scrollbar-thin">
              {updates.map((update) => (
                <div key={update._id} className="flex gap-3.5 items-start">
                  
                  {update.user?.profilePicture ? (
                    <img
                      src={update.user.profilePicture}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-[#EFE9DC] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center font-bold text-xs text-stone-600 uppercase flex-shrink-0">
                      {update.user?.name?.[0] || "U"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-700 leading-normal">
                      {getMessage(update)}
                    </p>
                    <p className="text-[10px] font-medium text-stone-400 mt-0.5">
                      {getTimeAgo(update.createdAt)}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ActivityDrawer;