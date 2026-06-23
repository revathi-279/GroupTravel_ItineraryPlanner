import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

// Premium minimalistic vectors matching our unified design identity ✨
import { X, Smile, User } from "lucide-react";

const ReactionsDrawer = ({ photo, onClose }) => {
  
  // Handle Escape key closure shortcut Safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!photo) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] overflow-hidden font-sans antialiased text-white select-none">
      
      {/* Dimmed Overlay Background Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs w-full h-full cursor-pointer"
      />

      {/* Primary Slide-Out Bottom/Side Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[380px] bg-[#0D0E0E] border-l border-neutral-800/80 shadow-2xl flex flex-col overflow-hidden"
      >
        
        {/* Drawer Heading Panel Row */}
        <div className="p-5 bg-neutral-950/40 border-b border-neutral-900 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-stone-400">
            <Smile size={16} className="text-[#2D6A4F]" />
            <h2 className="text-base font-bold tracking-tight text-white">
              Activity Overview
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close drawer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic List Breakdowns Context Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-900/60 bg-[#0D0E0E] scrollbar-thin">
          {["❤️", "😍", "🔥", "👍"].map((emoji) => {
            const reactors = photo?.reactions?.filter(
              (reaction) => reaction?.emoji === emoji
            ) || [];

            if (reactors.length === 0) return null;

            return (
              <div
                key={emoji}
                className="p-5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                {/* Category Section Mini Badge Header */}
                <div className="flex items-center gap-2">
                  <span className="text-lg select-none">{emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-stone-300">
                    {reactors.length} {reactors.length === 1 ? "reaction" : "reactions"}
                  </span>
                </div>

                {/* Sub-voters Rows Stack */}
                <div className="space-y-3 pl-0.5">
                  {reactors.map((reaction) => (
                    <div
                      key={reaction?.user?._id || Math.random()}
                      className="flex items-center gap-3 group/voter"
                    >
                      {/* Avatar Media Node Fallback */}
                      <div className="w-7 h-7 rounded-full bg-[#2D6A4F] border border-white/10 flex items-center justify-center text-white overflow-hidden flex-shrink-0 ring-2 ring-white/5">
                        {reaction?.user?.profilePicture ? (
                          <img
                            src={reaction.user.profilePicture}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-bold uppercase text-white/90">
                            {reaction?.user?.name?.[0] || <User size={10} />}
                          </span>
                        )}
                      </div>

                      {/* Participant Text Label */}
                      <span className="text-xs font-bold text-stone-300 group-hover/voter:text-white transition-colors truncate max-w-[220px]">
                        {reaction?.user?.name || "Group Traveler"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </motion.div>
    </div>,
    document.body
  );
};

export default ReactionsDrawer;