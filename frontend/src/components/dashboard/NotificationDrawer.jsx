import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Bell,
  X,
  Loader2,
  Check,
  CalendarDays,
  Wallet
} from "lucide-react";

const NotificationDrawer = ({
  open,
  onClose,
  notifications = [],
  loading,
  onAccept,
  onReject,
  onConfirmSettlement
}) => {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return createPortal(
    /* AnimatePresence must stay alive at the top level to catch the exit state */
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
          
          {/* 1. Backdrop overlay with smooth fade-out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full"
          />

          {/* 2. Sliding Sheet Panel with clean spring exit styling */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[420px] bg-white border-l border-[#EFE9DC] shadow-2xl flex flex-col z-10"
          >
            
            {/* Header Panel */}
            <div className="px-6 py-5 bg-white border-b border-[#F5F0E6] flex items-center justify-between select-none flex-shrink-0">
              <div className="flex items-center gap-2 text-[#2D6A4F]">
                <Bell size={16} />
                <h2 className="text-xs font-bold tracking-wider uppercase text-stone-400">
                  Inbox Feed
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all duration-200"
                aria-label="Close notification drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Core Content Layer */}
            <div className="flex-1 overflow-y-auto bg-[#FAF8F5]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-2.5 text-stone-400 py-20">
                  <Loader2 size={20} className="animate-spin text-[#2D6A4F]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Syncing Stream...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 py-20">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#EFE9DC] flex items-center justify-center mb-4 shadow-xs">
                    <Bell size={16} className="text-stone-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">
                    Your inbox is current
                  </h3>
                  <p className="text-xs text-stone-400 max-w-[240px] leading-relaxed font-medium">
                    Team trip invitations, balanced expenses, coordination polls, and gallery updates settle right here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5F0E6] bg-white h-auto min-h-full">
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
                        className="p-5 hover:bg-[#FAF8F5]/60 transition-all duration-150"
                      >
                        <p className="text-sm font-semibold text-slate-700 leading-relaxed tracking-tight">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium mt-2">
                          <CalendarDays size={12} className="text-stone-300 flex-shrink-0" />
                          <span>{formattedDate}</span>
                        </div>

                        {notification.type === "trip_invitation" && notification.status === "pending" && (
                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => onAccept?.(notification)}
                              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.97]"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => onReject?.(notification)}
                              className="bg-white hover:bg-stone-50 border border-[#EFE9DC] text-stone-500 hover:text-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-[0.97]"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {notification.type === "settlement" && notification.status === "pending" && (
                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => onConfirmSettlement?.(notification)}
                              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.97]"
                            >
                              Confirm
                            </button>
                          </div>
                        )}

                        {notification.type === "settlement" && notification.status === "accepted" && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#E9F5ED] border border-[#C1E2CE] px-2.5 py-0.5 rounded-md mt-3">
                            <Wallet size={10} />
                            <span>Payment Confirmed</span>
                          </div>
                        )}

                        {notification.type === "trip_invitation" && notification.status === "accepted" && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#E9F5ED] border border-[#C1E2CE] px-2.5 py-0.5 rounded-md mt-3 select-none">
                            <Check size={10} strokeWidth={3} />
                            <span>Joined Trip</span>
                          </div>
                        )}

                        {notification.type === "trip_invitation" && notification.status === "rejected" && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-md mt-3 select-none">
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
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NotificationDrawer;