import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Images, UploadCloud } from "lucide-react";

const EmptyGallery = ({ onUpload }) => {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-6 flex flex-col items-center text-center font-sans antialiased">
      
      {/* Premium Multi-Image Stack Visual Container Accent */}
      <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/60 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
        <Images size={22} className="text-[#1E4631]" />
      </div>

      {/* Main Framework Information Typography */}
      <h3 className="text-base font-bold text-gray-900 tracking-tight mb-2">
        No memories collected yet
      </h3>

      <p className="text-xs text-gray-400 max-w-xs mb-8 leading-relaxed">
        Capture and preserve your crew's timeline. Upload your first shared vacation snapshots, receipts, or panoramic memories.
      </p>

      {/* Interactive Trigger Upload CTA Action Button */}
      <button
        onClick={onUpload}
        className="flex items-center justify-center gap-2 bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all duration-200 active:scale-[0.98]"
      >
        <UploadCloud size={14} strokeWidth={2.5} />
        <span>Upload First Photo</span>
      </button>

    </div>
  );
};

export default EmptyGallery;