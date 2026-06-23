import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Images, UploadCloud } from "lucide-react";

const EmptyGallery = ({ onUpload }) => {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-6 flex flex-col items-center text-center font-sans antialiased text-slate-900 select-none">
      
      {/* Premium Multi-Image Stack Visual Container Accent */}
      <div className="w-14 h-14 bg-[#FAF8F5] border border-[#EFE9DC] rounded-2xl flex items-center justify-center mb-5 shadow-2xs text-[#2D6A4F]">
        <Images size={22} />
      </div>

      {/* Main Framework Information Typography */}
      <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1.5">
        No memories collected yet
      </h3>

      <p className="text-xs font-medium text-stone-400 max-w-xs mb-8 leading-relaxed">
        Capture and preserve your crew's timeline. Upload your first shared vacation snapshots, receipts, or panoramic scenery logs.
      </p>

      {/* Interactive Trigger Upload CTA Action Button */}
      <button
        type="button"
        onClick={onUpload}
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]"
      >
        <UploadCloud size={14} strokeWidth={2.5} />
        <span>Upload First Photo</span>
      </button>

    </div>
  );
};

export default EmptyGallery;