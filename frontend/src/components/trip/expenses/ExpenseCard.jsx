import React from "react";

// Premium minimalistic vectors matching our corporate design identity ✨
import { 
  Users, 
  ArrowRight, 
  Wallet, 
  Utensils, 
  Gem, 
  Hotel, 
  Car, 
  Ticket 
} from "lucide-react";

/**
 * Custom dynamic helper function to scan expense descriptions 
 * and render a highly context-relevant category icon vector.
 */
const getExpenseIcon = (titleString) => {
  if (!titleString) return <Wallet size={16} />;
  
  const text = titleString.toLowerCase();

  // 1. Food and Dining Categories
  if (
    text.includes("dinner") || 
    text.includes("lunch") || 
    text.includes("food") || 
    text.includes("cafe") || 
    text.includes("restaurant") || 
    text.includes("breakfast") || 
    text.includes("snacks")
  ) {
    return <Utensils size={16} />;
  }

  // 2. Shopping and Luxury Goods Categories
  if (
    text.includes("jewelleries") || 
    text.includes("shopping") || 
    text.includes("clothes") || 
    text.includes("gift") || 
    text.includes("gold")
  ) {
    return <Gem size={16} />;
  }

  // 3. Lodging and Accommodations Categories
  if (
    text.includes("hotel") || 
    text.includes("stay") || 
    text.includes("accommodation") || 
    text.includes("hostel") || 
    text.includes("airbnb")
  ) {
    return <Hotel size={16} />;
  }

  // 4. Transit and Transportation Categories
  if (
    text.includes("flight") || 
    text.includes("taxi") || 
    text.includes("fuel") || 
    text.includes("bus") || 
    text.includes("train") || 
    text.includes("travel") || 
    text.includes("transport") ||
    text.includes("cab")
  ) {
    return <Car size={16} />;
  }

  // 5. Entertainment and Outings Categories
  if (
    text.includes("entry") || 
    text.includes("movie") || 
    text.includes("event") || 
    text.includes("museum") || 
    text.includes("show") ||
    text.includes("ticket")
  ) {
    return <Ticket size={16} />;
  }

  // Default fallback layer matches generic ledger items cleanly
  return <Wallet size={16} />;
};

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

  const payerText = (() => {
    const payers = expense?.payers || [];

    if (payers.length === 0) {
      return "No payer";
    }

    // Checking both direct string references and populated object formats safely
    const firstPayerName = payers[0]?.user?.name || "Traveler";

    if (payers.length === 1) {
      return `Paid by ${firstPayerName}`;
    }

    if (payers.length === 2) {
      const secondPayerName = payers[1]?.user?.name || "Traveler";
      return `${firstPayerName} + ${secondPayerName}`;
    }

    return `${firstPayerName} + ${payers.length - 1} others`;
  })();

  return (
    <div
      onClick={() => onClick?.(expense)}
      className="bg-white border border-[#EFE9DC] rounded-2xl px-6 py-4.5 hover:shadow-xs hover:border-[#2D6A4F]/40 cursor-pointer transition-all duration-200 group font-sans antialiased text-slate-900"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-8 min-w-0 flex-1">
          
          {/* Dynamic Context Container Icon Indicator Block */}
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center text-[#2D6A4F] group-hover:bg-[#E9F5ED] group-hover:border-[#C1E2CE] transition-colors flex-shrink-0">
            {getExpenseIcon(expense?.title)}
          </div>

          {/* Expense Descriptor Text Content Block */}
          <div className="min-w-[220px] truncate">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              {expense?.title}
            </h3>
          </div>

          {/* Timestamp Log Display Metric */}
          <div className="min-w-[120px] text-xs font-semibold text-stone-400 select-none">
            {formattedDate}
          </div>

          {/* Multi-Payer Summary Summary Data Label */}
          <div className="min-w-[180px] text-xs font-bold text-slate-600 truncate">
            {payerText}
          </div>

          {/* Split Member Beneficiary Allocations Tracker Metric */}
          <div className="flex items-center gap-1.5 min-w-[110px] text-xs font-semibold text-stone-400 select-none">
            <Users size={14} className="text-stone-300" />
            <span>
              {expense?.participants?.length || 0} Members
            </span>
          </div>

        </div>

        {/* Financial Amount Value Row Column Output Panel */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="text-right">
            <p className="text-base font-black text-slate-800 tracking-tight">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <ArrowRight
            size={15}
            className="text-stone-300 group-hover:text-[#2D6A4F] group-hover:translate-x-0.5 transition-all duration-200"
          />
        </div>

      </div>
    </div>
  );
};

export default ExpenseCard;