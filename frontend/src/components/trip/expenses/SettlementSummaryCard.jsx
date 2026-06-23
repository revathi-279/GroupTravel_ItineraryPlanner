import React from "react";
import { ArrowRight, Landmark } from "lucide-react";

const SettlementSummaryCard = ({ settlements = [], onOpen }) => {
  // Safe calculation to sum up all uncompleted outstanding debts
  const totalOutstanding = settlements
    .filter((settlement) => settlement?.status !== "Settled")
    .reduce((sum, settlement) => sum + (Number(settlement?.amount) || 0), 0);

  // Filter count for remaining active debts
  const pendingCount = settlements.filter(
    (settlement) => settlement?.status !== "Settled"
  ).length;

  return (
    <div className="bg-white border border-[#EFE9DC] rounded-3xl p-6 shadow-2xs font-sans antialiased text-slate-900 select-none">
      
      {/* Card Header Tagline */}
      <div className="flex items-center gap-2 text-stone-400 mb-4">
        <Landmark size={14} className="text-stone-300" />
        <h3 className="text-[11px] font-bold uppercase tracking-wider">
          Settlement Status
        </h3>
      </div>

      {/* Metrics Split Display Matrix row */}
      <div className="grid grid-cols-2 gap-6 border-b border-[#FAF8F5] pb-4">
        
        {/* Metric Segment 1: Count */}
        <div className="space-y-0.5">
          <p className="text-2xl font-black text-slate-800 tracking-tight">
            {pendingCount}
          </p>
          <p className="text-xs font-semibold text-stone-400">
            Pending Settlements
          </p>
        </div>

        {/* Metric Segment 2: Financial Aggregates */}
        <div className="space-y-0.5 border-l border-[#FAF8F5] pl-6">
          <p className="text-2xl font-black text-[#2D6A4F] tracking-tight">
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </p>
          <p className="text-xs font-semibold text-stone-400">
            Outstanding Amount
          </p>
        </div>

      </div>

      {/* Bottom Interactive Navigation Link */}
      <button
        onClick={onOpen}
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2D6A4F] hover:text-[#1B4332] transition-colors group"
      >
        <span>View Details</span>
        <ArrowRight 
          size={14} 
          className="transform group-hover:translate-x-0.5 transition-transform duration-200" 
        />
      </button>

    </div>
  );
};

export default SettlementSummaryCard;