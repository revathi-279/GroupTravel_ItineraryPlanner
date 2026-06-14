import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { BarChart3, Plus } from "lucide-react";

const EmptyPolls = ({ onCreate }) => {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-6 flex flex-col items-center text-center font-sans antialiased">
      
      {/* Premium Circular Visual Accent Wrapper Icon */}
      <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/60 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
        <BarChart3 size={24} className="text-[#1E4631]" />
      </div>

      {/* Main Structural Information Typography */}
      <h3 className="text-base font-bold text-gray-900 tracking-tight mb-2">
        No group polls created yet
      </h3>

      <p className="text-xs text-gray-400 max-w-xs mb-8 leading-relaxed">
        Can't agree on dining spots, departure hours, or hotel rooms? Launch a custom group vote to make decisions together seamlessly.
      </p>

      {/* Interactive Trigger CTA Action Button */}
      <button
        onClick={onCreate}
        className="flex items-center justify-center gap-1.5 bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all duration-200 active:scale-[0.98]"
      >
        <Plus size={14} strokeWidth={2.5} />
        <span>Create First Poll</span>
      </button>

    </div>
  );
};

export default EmptyPolls;