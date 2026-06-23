import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

// Premium minimalistic vectors matching our corporate design identity ✨
import { X, BarChart3, Users, UserCheck } from "lucide-react";

const PollDrawer = ({ poll, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!poll) return null;

  const isClosed = poll.expiresAt && new Date() > new Date(poll.expiresAt);

  return createPortal(
    <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
      
      {/* Smooth Blurred Dimmed Overlay Backdrop */}
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full cursor-pointer"
      />

      {/* Primary Slide-Out Panel Container */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[460px] bg-white border-l border-[#EFE9DC] shadow-2xl flex flex-col overflow-hidden"
      >
        
        {/* Fixed Header Section */}
        <div className="p-6 bg-white border-b border-[#F5F0E6] flex items-center justify-between flex-shrink-0 select-none">
          <div className="flex items-center gap-2 text-[#2D6A4F]">
            <BarChart3 size={18} />
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Poll Breakdowns
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Dynamic Body Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white scrollbar-thin">
          
          {/* Active / Closed Meta Badge Pill Container row */}
          <div className="flex items-center gap-2 select-none">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isClosed ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-[#E9F5ED] border-[#C1E2CE] text-[#2D6A4F]"
            }`}>
              {isClosed ? "Poll Closed" : "Poll Active"}
            </span>

            {!isClosed && poll.expiresAt && (
              <span className="text-[10px] font-semibold text-stone-400">
                Active until {new Date(poll.expiresAt).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
                })}
              </span>
            )}
          </div>
          
          {/* Section 1: Question Topic & Creator Label */}
          <div className="bg-[#FAF8F5] border border-[#EFE9DC]/70 p-5 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-base font-bold tracking-tight text-slate-800 leading-snug break-words">
              {poll?.question}
            </h3>

            <div className="flex items-center gap-2.5 pt-3 border-t border-[#EFE9DC]/40 select-none">
              <div className="w-8 h-8 rounded-full bg-white border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0">
                {poll?.createdBy?.profilePicture ? (
                  <img src={poll.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold uppercase text-stone-400">{poll?.createdBy?.name?.[0]}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none mb-0.5">
                  {poll?.createdBy?.name || "Group Member"}
                </p>
                <p className="text-[10px] font-semibold text-stone-400 leading-none">
                  Created this poll topic
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Option-By-Option Voting List Headers */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 px-1 select-none">
              <Users size={14} className="text-stone-400" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Responses Breakdown
              </h4>
            </div>

            {poll?.options?.map((option) => (
              <div 
                key={option._id} 
                className="bg-white border border-[#EFE9DC] rounded-2xl overflow-hidden shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Individual Option Title Sticky Header Bar */}
                <div className="bg-[#FAF8F5]/50 px-4 py-3 border-b border-[#FAF8F5] flex items-center justify-between gap-4 select-none">
                  <span className="text-sm font-bold text-slate-800 truncate">
                    {option.text}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9F5ED] border border-[#C1E2CE] text-[#2D6A4F] px-2 py-0.5 rounded-md flex-shrink-0">
                    {option.votes?.length || 0} {option.votes?.length === 1 ? "Vote" : "Votes"}
                  </span>
                </div>

                {/* Voter Rows Collection Stack */}
                <div className="divide-y divide-[#FAF8F5] px-4 py-1.5">
                  {option.votes?.length === 0 ? (
                    <div className="py-4 text-center select-none">
                      <p className="text-xs font-semibold text-stone-400">
                        No participants voted for this option yet
                      </p>
                    </div>
                  ) : (
                    option.votes.map((voter) => (
                      <div 
                        key={voter._id} 
                        className="py-2.5 flex items-center justify-between gap-3 group/voter animate-in fade-in duration-150"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0 select-none">
                            {voter.profilePicture ? (
                              <img src={voter.profilePicture} alt={voter.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[9px] font-bold uppercase text-stone-400">{voter.name?.[0]}</span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate group-hover/voter:text-slate-900 transition-colors">
                            {voter.name}
                          </span>
                        </div>
                        
                        <UserCheck size={14} className="text-[#2D6A4F]/40 opacity-0 group-hover/voter:opacity-100 transition-all duration-200 flex-shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default PollDrawer;