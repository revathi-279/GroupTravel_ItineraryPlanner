import React from "react";
import { theme } from "../../../common/common";
import { Map, Plus } from "lucide-react";

const EmptyItinerary = ({ onCreate, isAdmin = true }) => {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE9DC] shadow-2xs max-w-xl mx-auto my-12 font-sans antialiased text-slate-900 select-none animate-in fade-in zoom-in-95 duration-200">
      
      {/* Premium Minimalist Vector Placeholder */}
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center mx-auto mb-5 text-stone-400">
        <Map size={26} strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-bold text-slate-800 tracking-tight">
        No plans added yet
      </h2>

      <p className="text-xs font-semibold text-stone-400 mt-2 max-w-xs mx-auto leading-relaxed">
        Start pinning stops, attractions, or meal coordination plans onto your shared journey timeline.
      </p>

      {/* Button rendering check fixed to allow immediate creation triggers */}
      {isAdmin && (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] mt-6"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add First Event</span>
        </button>
      )}

    </div>
  );
};

export default EmptyItinerary;