import { useEffect } from "react";
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

  return (
    <>
      {/* Smooth Blurred Dimmed Overlay Backdrop */}
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
      />

      {/* Primary Slide-Out Panel Container */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-[#FAFAFA] border-l border-gray-200/80 shadow-2xl z-50 flex flex-col font-sans antialiased text-gray-900"
      >
        
        {/* Fixed Header Section */}
        <div className="p-6 bg-white border-b border-gray-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1E4631]">
            <BarChart3 size={18} />
            <h2 className="text-base font-bold tracking-tight text-gray-900">
              Poll Breakdowns
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Dynamic Body Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Question Topic & Creator Label */}
          <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-base font-bold tracking-tight text-gray-900 leading-snug">
              {poll?.question}
            </h3>

            <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden flex-shrink-0">
                {poll?.createdBy?.profilePicture ? (
                  <img src={poll.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold uppercase">{poll?.createdBy?.name?.[0]}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-none mb-0.5">
                  {poll?.createdBy?.name || "Group Member"}
                </p>
                <p className="text-[10px] font-medium text-gray-400 leading-none">
                  Created this poll topic
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Option-By-Option Voting List Headers */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 px-1">
              <Users size={14} className="text-gray-400" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Responses Breakdown
              </h4>
            </div>

            {poll?.options?.map((option) => (
              <div 
                key={option._id} 
                className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Individual Option Title Sticky Header Bar */}
                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-gray-800 truncate">
                    {option.text}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E4631]/5 text-[#1E4631] px-2 py-0.5 rounded-md flex-shrink-0">
                    {option.votes?.length || 0} {option.votes?.length === 1 ? "Vote" : "Votes"}
                  </span>
                </div>

                {/* Voter Rows Collection Stack */}
                <div className="divide-y divide-gray-50 px-4 py-2">
                  {option.votes?.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-xs font-medium text-gray-400">
                        No participants voted for this option yet
                      </p>
                    </div>
                  ) : (
                    option.votes.map((voter) => (
                      <div 
                        key={voter._id} 
                        className="py-2.5 flex items-center justify-between gap-3 group/voter animate-in fade-in duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-600 overflow-hidden ring-2 ring-gray-100/50 flex-shrink-0">
                            {voter.profilePicture ? (
                              <img src={voter.profilePicture} alt={voter.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold uppercase text-gray-500">{voter.name?.[0]}</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-700 group-hover/voter:text-gray-900 transition-colors">
                            {voter.name}
                          </span>
                        </div>
                        
                        <UserCheck size={14} className="text-[#1E4631]/40 opacity-0 group-hover/voter:opacity-100 transition-all duration-200" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default PollDrawer;