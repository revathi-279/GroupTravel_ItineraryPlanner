import React from "react";
import { theme } from "../../common/common";

// Premium icon package import to eliminate emojis ✨
import { Globe, Plus } from "lucide-react";

const EmptyState = ({ onCreateClick }) => {
  return (
    <div
      className={`
        ${theme.emptyState.container}
        w-full max-w-md mx-auto py-12 px-6
        flex flex-col items-center text-center
        font-sans antialiased
      `}
    >
      {/* Premium Circular Globe Icon Container */}
      <div className="w-16 h-16 bg-gradient-to-br from-[#F4F7F5] to-[#EBF2EE] border border-[#E2EAE5] rounded-2xl flex items-center justify-center mb-6 shadow-xs animate-bounce duration-1000">
        <Globe size={28} className="text-[#2F6F4E]" />
      </div>

      {/* Primary Message Header */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-2.5">
        Your next adventure starts here
      </h2>

      {/* Explanatory Context Subtitle */}
      <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
        Create your first journey and start organizing itineraries, split expenses, and travel seamlessly together.
      </p>

      {/* Dynamic Main Action Button */}
      <button
        onClick={onCreateClick}
        className={`
          ${theme.buttons.primary}
          flex items-center justify-center gap-2 px-6 py-3.5 
          bg-[#2F6F4E] text-white font-semibold rounded-xl text-sm 
          transition-all duration-200 hover:bg-[#23543b] active:scale-[0.99] 
          shadow-md shadow-[#2F6F4E]/10
        `}
      >
        <Plus size={16} strokeWidth={2.5} />
        Create Journey
      </button>
    </div>
  );
};

export default EmptyState;