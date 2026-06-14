import React from "react";

// Kept your premium icon choices uniform with Lucide icons ✨
import { Download } from "lucide-react";

const PhotoCard = ({ photo, onClick }) => {
  const totalReactions = photo?.reactions?.length || 0;

  const handleDownload = async (e) => {
    e.stopPropagation(); // Avoid triggering full-screen preview clicks
    try {
      const response = await fetch(photo.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `memory-${photo._id || "download"}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Failed to safely stream image file data:", error);
    }
  };

  return (
    <div
      onClick={() => onClick?.(photo)}
      className="relative group break-inside-avoid mb-5 cursor-pointer overflow-hidden rounded-2xl bg-gray-100 border border-gray-200/40 shadow-xs hover:shadow-lg transition-all duration-300"
    >
      {/* Primary Media Asset Rendering */}
      <img
        src={photo.imageUrl}
        alt={photo.caption || "Trip memory"}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />

      {/* Smooth Elegant Gradient Vignette Hover Overlay Track */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        
        {/* Top-Right: Absolute Glassmorphism Download CTA */}
        <button
          onClick={handleDownload}
          className="absolute top-3.5 right-3.5 bg-black/40 hover:bg-[#1E4631] text-white p-2.5 rounded-xl transition-all duration-200 backdrop-blur-xs active:scale-95 border border-white/10"
          title="Download high-res original"
        >
          <Download size={14} strokeWidth={2.5} />
        </button>

        {/* Bottom-Left: Group Reactions Counter Hub Panel */}
        <div className="absolute bottom-3.5 left-3.5 flex flex-wrap gap-1.5 max-w-[85%]">
          {["❤️", "😍", "🔥", "👍"].map((emoji) => {
            const count = photo.reactions?.filter(
              (reaction) => reaction.emoji === emoji
            ).length;

            if (!count || count === 0) return null;

            return (
              <div
                key={emoji}
                className="inline-flex items-center gap-1 bg-white/10 text-white border border-white/10 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-bold shadow-xs animate-in fade-in zoom-in-90 duration-150 select-none"
              >
                <span>{emoji}</span>
                <span className="text-white/90 font-sans">{count}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PhotoCard;