import { useEffect } from "react";
import { motion } from "framer-motion";

// Premium minimalist vectors matching our unified design identity ✨
import { X, Smile, User } from "lucide-react";

const ReactionsDrawer = ({ photo, onClose }) => {
  
  // Handle Escape key closure shortcut
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Dimmed Overlay Background Layer */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-xs z-[120] transition-opacity"
      />

      {/* Primary Slide-Out Bottom/Side Drawer Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 220 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-[#0B0D0C] border-l border-white/5 shadow-2xl z-[130] flex flex-col font-sans antialiased text-white overflow-y-auto"
      >
        
        {/* Drawer Heading Panel Row */}
        <div className="p-5 bg-neutral-950/40 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Smile size={16} />
            <h2 className="text-sm font-bold tracking-tight text-white">
              Activity Overview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            aria-label="Close drawer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic List Breakdowns Context Feed */}
        <div className="flex-1 divide-y divide-white/5">
          {["❤️", "😍", "🔥", "👍"].map((emoji) => {
            const reactors = photo?.reactions?.filter(
              (reaction) => reaction?.emoji === emoji
            ) || [];

            if (reactors.length === 0) return null;

            return (
              <div
                key={emoji}
                className="p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Category Section Mini Badge Header */}
                <div className="flex items-center gap-2">
                  <span className="text-lg select-none">{emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-300">
                    {reactors.length} {reactors.length === 1 ? "reaction" : "reactions"}
                  </span>
                </div>

                {/* Sub-voters Rows Stack */}
                <div className="space-y-3 pl-1">
                  {reactors.map((reaction) => (
                    <div
                      key={reaction?.user?._id || Math.random()}
                      className="flex items-center gap-3 group/voter"
                    >
                      {/* Avatar Media Node Fallback */}
                      <div className="w-7 h-7 rounded-full bg-[#1E4631] border border-white/10 flex items-center justify-center text-white overflow-hidden flex-shrink-0 ring-2 ring-white/5">
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
                      <span className="text-xs font-semibold text-gray-300 group-hover/voter:text-white transition-colors truncate max-w-[240px]">
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
    </>
  );
};

export default ReactionsDrawer;