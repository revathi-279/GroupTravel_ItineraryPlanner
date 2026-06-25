import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Wallet, Plus } from "lucide-react";

const EmptyExpenses = ({ onCreate, isAdmin }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200/60 rounded-[32px] p-10 text-center font-sans antialiased text-gray-900 shadow-2xs select-none">
      
      {/* Premium Wallet Visual Container Accent */}
      <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/60 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-2xs text-[#1E4631]">
        <Wallet size={22} className="stroke-[2]" />
      </div>

      {/* Main Information Typography */}
      <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1.5">
        No expenses tracked yet
      </h3>

      <p className="text-xs font-medium text-gray-400 max-w-xs mb-8 leading-relaxed mx-auto">
        Keep your crew's balance transparent. Start logging shared stays, transport passes, local dinners, and group activity rates.
      </p>

      {/* Interactive Trigger Upload CTA Action Button */}
      {isAdmin && (
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-xs transition-all duration-200 active:scale-[0.98]"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add First Expense</span>
        </button>
      )}

    </div>
  );
};

export default EmptyExpenses;

