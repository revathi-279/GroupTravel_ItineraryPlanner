import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowRight, CheckCircle2, Clock, Filter } from "lucide-react";
import { settlementService } from "../../../services/settlementService";

const SettlementDrawer = ({
  open,
  onClose,
  settlements = [],
  currentUser,
  refreshSettlements
}) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  // Custom Filters: "all" | "incoming" (owed to me) | "outgoing" (i owe)
  const [filterType, setFilterType] = useState("all"); 

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const totalOutstanding = settlements
    .filter(settlement => settlement.status !== "Settled")
    .reduce((sum, settlement) => sum + (Number(settlement.amount) || 0), 0);

  const filteredSettlements = useMemo(() => {
    let results = settlements.filter((settlement) => {
      const isDebtor = String(settlement.from?._id) === String(currentUser?._id);
      const isReceiver = String(settlement.to?._id) === String(currentUser?._id);

      // 1. Filter Type Validation Logic Match
      if (filterType === "outgoing" && !isDebtor) return false;
      if (filterType === "incoming" && !isReceiver) return false;

      // 2. Search Text Input Parsing
      const query = search.toLowerCase();
      if (!query) return true;
      return (
        settlement.from?.name?.toLowerCase().includes(query) ||
        settlement.to?.name?.toLowerCase().includes(query)
      );
    });

    // 3. Sorting Execution Table Logic
    if (sortBy === "name") {
      results.sort((a, b) => (a.from?.name || "").localeCompare(b.from?.name || ""));
    } else if (sortBy === "high") {
      results.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortBy === "low") {
      results.sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    return results;
  }, [settlements, search, sortBy, filterType, currentUser]);

  const handleMarkPaid = async (settlementId) => {
    try {
      await settlementService.markPaid(settlementId);
      await refreshSettlements();
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async (settlementId) => {
    try {
      await settlementService.confirmPayment(settlementId);
      await refreshSettlements();
    } catch (error) {
      console.log(error);
    }
  };

  // Removed early return guard to allow AnimatePresence exit animations to trigger completely!

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
          
          {/* Backdrop Layer Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full cursor-pointer"
          />

          {/* Main Slide Sheet Panel Box */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[460px] bg-white border-l border-[#EFE9DC] shadow-2xl z-10 flex flex-col overflow-hidden"
          >
            
            {/* Header Filter Panel Segment Row */}
            <div className="p-6 border-b border-[#F5F0E6] select-none flex-shrink-0 bg-white space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">
                    Settlement Summary
                  </h2>
                  <p className="text-xs font-semibold text-stone-400 mt-1">
                    {settlements.filter(s => s.status !== "Settled").length} payments pending
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Outstanding Financial Balance Block */}
              <div>
                <p className="text-2xl font-black text-[#2D6A4F] tracking-tight">
                  ₹{totalOutstanding.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                  Outstanding Amount
                </p>
              </div>

              {/* Dynamic Search Input Row */}
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search member..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#2D6A4F] transition-all"
                />
              </div>

              {/* Twin Filter Selection Bar Options */}
              <div className="flex gap-2">
                
                {/* 1. Custom Scope Filter Type Dropdown */}
                <div className="relative flex-1 group">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full appearance-none pl-8 pr-8 py-2 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-[#2D6A4F] transition-all"
                    style={{ minHeight: "34px" }}
                  >
                    <option value="all">All Payments</option>
                    <option value="outgoing">Only Owed</option>
                    <option value="incoming">Only Owed to Me</option>
                  </select>
                  <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>

                {/* 2. Sorting Directives Filter */}
                <div className="relative group min-w-[100px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-[#2D6A4F] transition-all"
                    style={{ minHeight: "34px" }}
                  >
                    <option value="name">A-Z</option>
                    <option value="high">Highest</option>
                    <option value="low">Lowest</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>

              </div>
            </div>

            {/* Scrollable Core Item List Stack Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-white scrollbar-thin">
              {filteredSettlements.length === 0 ? (
                <div className="text-center py-12 text-xs font-bold uppercase tracking-wider text-stone-300 select-none">
                  No settlements found
                </div>
              ) : (
                filteredSettlements.map((settlement, index) => {
                  const isDebtor = String(settlement.from?._id) === String(currentUser?._id);
                  const isReceiver = String(settlement.to?._id) === String(currentUser?._id);

                  const fromName = isDebtor ? `${settlement.from?.name} (You)` : settlement.from?.name || "Traveler";
                  const toName = isReceiver ? `${settlement.to?.name} (You)` : settlement.to?.name || "Traveler";

                  return (
                    <div
                      key={settlement._id || index}
                      className="border border-[#EFE9DC] rounded-2xl p-4 flex flex-col space-y-4 bg-white shadow-2xs"
                    >
                      {/* Identity Row Flow Layout Frame */}
                      <div className="flex items-center justify-between gap-4 min-w-0">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          
                          {/* Debtor Profile Emblem */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-50 border border-[#EFE9DC] flex-shrink-0 select-none">
                              {settlement.from?.profilePicture ? (
                                <img src={settlement.from.profilePicture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase text-stone-400">
                                  {settlement.from?.name?.[0] || "U"}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-800 truncate">{fromName}</span>
                          </div>

                          <ArrowRight size={13} className="text-stone-300 flex-shrink-0" />

                          {/* Creditor Profile Emblem */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-50 border border-[#EFE9DC] flex-shrink-0 select-none">
                              {settlement.to?.profilePicture ? (
                                <img src={settlement.to.profilePicture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase text-stone-400">
                                  {settlement.to?.name?.[0] || "U"}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-800 truncate">{toName}</span>
                          </div>

                        </div>

                        {/* Amount Metric String */}
                        <span className="text-sm font-black text-slate-800 flex-shrink-0 pl-1 select-none">
                          ₹{(Number(settlement.amount) || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Execution Controls Row Panel */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#FAF8F5] select-none">
                        
                        {/* Dynamic Status Capsule Tags */}
                        {(() => {
                          let statusText = settlement.status;
                          if (settlement.status === "AwaitingConfirmation") {
                            statusText = isDebtor ? "Awaiting Confirmation" : "Pending Action";
                          }

                          return (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              settlement.status === "Settled"
                                ? "bg-[#E9F5ED] border-[#C1E2CE] text-[#2D6A4F]"
                                : settlement.status === "AwaitingConfirmation"
                                ? "bg-amber-50 border-amber-100 text-amber-700"
                                : "bg-stone-50 border-[#EFE9DC] text-stone-400"
                            }`}>
                              {settlement.status === "Settled" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                              <span>{statusText}</span>
                            </span>
                          );
                        })()}

                        {/* Functional Action Trigger Triggers */}
                        {settlement.status === "Pending" && isDebtor && (
                          <button
                            onClick={() => handleMarkPaid(settlement._id)}
                            className="px-3 py-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-2xs transition-all active:scale-[0.98]"
                          >
                            Mark Paid
                          </button>
                        )}

                        {settlement.status === "AwaitingConfirmation" && isReceiver && (
                          <button
                            onClick={() => handleConfirm(settlement._id)}
                            className="px-3 py-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-2xs transition-all active:scale-[0.98]"
                          >
                            Confirm Payment
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Chevron vector component helper
const ChevronDown = ({ size = 14, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" size={size} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

export default SettlementDrawer;