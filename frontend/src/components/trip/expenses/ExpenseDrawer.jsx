import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { theme } from "../../../common/common";

// Premium minimalistic vectors matching our unified design identity ✨
import { X, CreditCard, Users, Coins, FileText, Edit2, Trash2, MoreVertical, ShieldCheck, User } from "lucide-react";

const ExpenseDrawer = ({
  expense,
  trip,
  currentUser,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Handle Escape key closure shortcuts safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Handle clicking outside the three-dots menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!expense) return null;

  const totalAmount = expense.payers?.reduce(
    (sum, payer) => sum + (Number(payer?.amount) || 0),
    0
  ) || 0;

  const currentUserId = currentUser?.id || currentUser?._id;
  const isAdmin = trip?.admins?.some(
    (admin) => admin._id?.toString() === currentUserId?.toString()
  );

  return (
    <>
      {/* Smooth Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
      />

      {/* Main Structural Slide Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 220 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FAFAFA] border-l border-gray-200/80 shadow-2xl z-50 flex flex-col font-sans antialiased text-gray-900"
      >
        
        {/* 1. Header Section with Actions and Three-Dots Menu */}
        <div className="p-6 bg-white border-b border-gray-200/60 flex items-center justify-between relative">
          <div className="flex items-center gap-2 text-[#1E4631]">
            <CreditCard size={16} />
            <h2 className="text-sm font-bold tracking-tight text-gray-900">
              Expense Overview
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {/* Context Actions Menu (Three-Dots Trigger) */}
            {isAdmin && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                  aria-label="Manage expense options"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu Overlay */}
                {showMenu && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right">
                    <button
                      onClick={() => { onEdit?.(expense); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Edit2 size={13} className="text-gray-400" />
                      <span>Modify Details</span>
                    </button>
                    
                    <div className="border-t border-gray-50 my-1" />
                    
                    <button
                      onClick={() => { onDelete?.(expense); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50/50 transition-colors text-left"
                    >
                      <Trash2 size={13} />
                      <span>Void Ledger Item</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Default Header Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Main Title & Invoice Sheet Value Block */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md inline-block">
              Financial Statement
            </span>
            <h3 className="text-base font-bold tracking-tight text-gray-800 max-w-xs mx-auto leading-snug">
              {expense.title}
            </h3>
            <p className="text-3xl font-black text-[#1E4631] tracking-tight pt-1">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Reference Notes Description Block */}
          {expense.notes && (
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FileText size={13} /> Ledger Notes
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Payee Splits Breakdown Block */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-3.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Coins size={13} /> Funding Allocations
            </h4>
            
            <div className="divide-y divide-gray-50 space-y-2.5 first:pt-0">
              {expense.payers?.map((payer) => (
                <div key={payer?.user?._id || Math.random()} className="flex items-center justify-between pt-2.5 first:pt-0 text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden flex-shrink-0">
                      {payer?.user?.profilePicture ? (
                        <img src={payer.user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-gray-400">
                          {payer?.user?.name?.[0] || "U"}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-700">{payer?.user?.name || "Group Traveler"}</span>
                  </div>
                  <span className="text-gray-900 font-extrabold">
                    ₹{(Number(payer?.amount) || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Split Beneficiaries Badges Block */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Users size={13} /> Split Beneficiaries
            </h4>
            
            <div className="flex flex-wrap gap-1.5">
              {expense.participants?.map((participant) => (
                <span
                  key={participant?._id}
                  className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200/40 px-2.5 py-1 rounded-md shadow-xs select-none"
                >
                  {participant?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Core System Audit Logs Block */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-xs divide-y divide-gray-50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden flex-shrink-0">
                {expense.createdBy?.profilePicture ? (
                  <img src={expense.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] font-bold uppercase text-gray-400">{expense.createdBy?.name?.[0]}</span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1">
                  Logged By
                </p>
                <p className="text-xs font-bold text-gray-700 leading-none">
                  {expense.createdBy?.name || "Traveler"}
                </p>
              </div>
            </div>

            {expense.updatedBy && (
              <div className="flex items-center gap-3 pt-3 animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden flex-shrink-0">
                  {expense.updatedBy?.profilePicture ? (
                    <img src={expense.updatedBy.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] font-bold uppercase text-gray-400">{expense.updatedBy?.name?.[0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1">
                    Audited By
                  </p>
                  <p className="text-xs font-bold text-gray-700 leading-none">
                    {expense.updatedBy?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 3. Redesigned Clean Action Footer */}
        <div className="p-6 bg-white border-t border-gray-200/60">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200/70 text-gray-700 text-xs font-bold rounded-xl transition-all active:scale-[0.99]"
          >
            Close Profile View
          </button>
        </div>

      </motion.div>
    </>
  );
};

export default ExpenseDrawer;