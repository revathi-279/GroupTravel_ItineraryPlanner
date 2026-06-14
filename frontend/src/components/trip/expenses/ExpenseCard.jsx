import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { CreditCard, Users, ArrowRight } from "lucide-react";

const ExpenseCard = ({ expense, onClick }) => {
  // Safe calculation parsing to prevent fallback errors
  const totalAmount = expense?.payers?.reduce(
    (sum, payer) => sum + (Number(payer?.amount) || 0),
    0
  ) || 0;

  const formattedDate = expense?.createdAt
    ? new Date(expense.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <div
      onClick={() => onClick?.(expense)}
      className="
        bg-white border border-gray-200/60 rounded-2xl p-5 
        hover:shadow-md hover:border-gray-300 cursor-pointer 
        transition-all duration-200 font-sans antialiased flex flex-col justify-between group
      "
    >
      {/* Top Section: Icon, Title, and Amount Grid */}
      <div className="flex items-start justify-between gap-4">
        
        {/* Left: Identity Track */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/40 flex items-center justify-center text-gray-500 group-hover:text-[#1E4631] group-hover:bg-[#1E4631]/5 transition-colors flex-shrink-0">
            <CreditCard size={16} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-800 tracking-tight truncate max-w-[180px] leading-tight mb-1 group-hover:text-[#1E4631] transition-colors">
              {expense?.title || "Untitled Expense"}
            </h3>
            <p className="text-[11px] text-gray-400 font-medium leading-none">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right: Currency Balance Summary */}
        <div className="text-right flex-shrink-0">
          <p className="text-base font-extrabold text-gray-900 tracking-tight leading-tight mb-0.5">
            ₹{totalAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Total Bill
          </p>
        </div>

      </div>

      {/* Bottom Section: Participant Metadata & Action Links */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
        
        {/* Status Chips and Counters */}
        <div className="flex items-center gap-2.5">
          {/* Custom Luxury Settled Indicator Badge */}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E4631]/5 text-[#1E4631] px-2.5 py-1 rounded-md">
            Settled
          </span>
          
          <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
            <Users size={12} className="text-gray-300" />
            <span>
              {expense?.participants?.length || 0} split{expense?.participants?.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Minimalist Micro Chevron Link Asset */}
        <div className="text-gray-300 group-hover:text-gray-600 transform group-hover:translate-x-0.5 transition-all">
          <ArrowRight size={14} />
        </div>

      </div>

    </div>
  );
};

export default ExpenseCard;