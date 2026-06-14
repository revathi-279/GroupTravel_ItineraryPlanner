import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Bell, X, Loader2, Check, CornerDownRight, CalendarDays } from "lucide-react";

const NotificationDrawer = ({
  open,
  onClose,
  notifications = [],
  loading,
  onAccept,
  onReject,
}) => {
  
  // Handle Escape key closure shortcuts safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans antialiased text-gray-900">
        
        {/* 1. Backdrop Blur Dimmer Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-xs"
        />

        {/* 2. Main Sidebar Sliding Sheet Canvas */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 220 }}
          className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-gray-200/60 shadow-2xl flex flex-col"
        >
          
          {/* Header Panel */}
          <div className="px-6 py-5 bg-white border-b border-gray-200/60 flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-[#1E4631]">
              <Bell size={16} />
              <h2 className="text-sm font-bold tracking-wider uppercase text-gray-400">
                Inbox Feed
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
              aria-label="Close notification drawer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Core Notification Content Layer */}
          <div className="flex-1 overflow-y-auto min-h-0 bg-[#FAFAFA]">
            {loading ? (
              /* High-End Vector Loader Ring State */
              <div className="h-full flex flex-col items-center justify-center gap-2.5 text-gray-400">
                <Loader2 size={20} className="animate-spin text-[#1E4631]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Syncing Stream...</span>
              </div>
            ) : notifications.length === 0 ? (
              /* Completely Empty Content Fallback State */
              <div className="h-full flex flex-col items-center justify-center text-center px-8 py-12 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200/40 flex items-center justify-center mb-4 shadow-xs">
                  <Bell size={16} className="text-gray-300" />
                </div>
                <h3 className="text-xs font-bold text-gray-800 tracking-tight mb-1">
                  Your inbox is current
                </h3>
                <p className="text-[11px] text-gray-400 max-w-[240px] leading-relaxed font-medium">
                  Team trip invitations, balanced expenses, coordination polls, and gallery updates settle right here.
                </p>
              </div>
            ) : (
              /* Active Notifications Mapping Collection */
              <div className="divide-y divide-gray-100 bg-white">
                {notifications.map((notification) => {
                  const formattedDate = notification?.createdAt
                    ? new Date(notification.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={notification._id}
                      className="p-5 hover:bg-gray-50/50 transition-all duration-150 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      {/* Message Body Content */}
                      <p className="text-xs font-semibold text-gray-700 leading-relaxed tracking-tight">
                        {notification.message}
                      </p>

                      {/* Timestamp Footnote Metarow */}
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium mt-2">
                        <CalendarDays size={11} className="text-gray-300 flex-shrink-0" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Case Handling Action Toolbars: Trip Invitations Processing */}
                      {notification.type === "trip_invitation" && notification.status === "pending" && (
                        <div className="flex items-center gap-2 mt-4 pl-1">
                          <button
                            onClick={() => onAccept?.(notification)}
                            className="bg-[#1E4631] hover:bg-[#153122] text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide shadow-xs transition-all active:scale-[0.97]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onReject?.(notification)}
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-800 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all active:scale-[0.97]"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Case Handling Badge Tracker: Invitation Accepted Status */}
                      {notification.status === "accepted" && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1E4631] bg-[#1E4631]/5 px-2 py-0.5 rounded-md mt-3 select-none">
                          <Check size={10} strokeWidth={3} />
                          <span>Joined Trip</span>
                        </div>
                      )}

                      {/* Case Handling Badge Tracker: Invitation Declined Status */}
                      {notification.status === "rejected" && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md mt-3 select-none">
                          <X size={10} strokeWidth={3} />
                          <span>Declined</span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDrawer;