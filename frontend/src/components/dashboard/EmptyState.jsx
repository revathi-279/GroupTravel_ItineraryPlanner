import React from "react";
import { theme } from "../../common/common";
import { Globe, Plus } from "lucide-react";

const EmptyState = ({ onCreateClick }) => {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-6 flex flex-col items-center text-center font-sans antialiased">
      
      {/* Premium Circular Globe Icon Container */}
      <div className="w-16 h-16 bg-[#FAF8F5] border border-[#EFE9DC] rounded-2xl flex items-center justify-center mb-6 shadow-xs">
        <Globe size={26} className="text-[#2D6A4F]" />
      </div>

      {/* Primary Message Header */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
        Your next adventure starts here
      </h2>

      {/* Explanatory Context Subtitle */}
      <p className="text-sm text-stone-500 max-w-xs mb-8 leading-relaxed">
        Create your first journey and start organizing itineraries, split expenses, and travel seamlessly together.
      </p>

      {/* Dynamic Main Action Button */}
      <button
        onClick={onCreateClick}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-[0.99] shadow-xs"
      >
        <Plus size={16} strokeWidth={2.5} />
        Create Journey
      </button>
    </div>
  );
};

export default EmptyState;