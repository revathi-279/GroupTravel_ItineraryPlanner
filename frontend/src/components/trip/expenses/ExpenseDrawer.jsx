import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
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
    (admin) => {
      const adminId = admin?._id || admin;
      return String(adminId) === String(currentUserId);
    }
  );

  return createPortal(
    <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
      
      {/* 1. Backdrop layer protecting layout color temperature stability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full cursor-pointer"
      />

      {/* 2. Main Slide Drawer Sheet Panel Canvas - Pure White Base */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[440px] bg-white border-l border-[#EFE9DC] shadow-2xl flex flex-col overflow-hidden"
      >
        
        {/* Header Action Control Row Container */}
        <div className="p-6 bg-white border-b border-[#F5F0E6] flex items-center justify-between event-menu-container select-none flex-shrink-0">
          <div className="flex items-center gap-2 text-[#2D6A4F]">
            <CreditCard size={16} />
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Expense Overview
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Context Actions Dropdown Toggle */}
            {isAdmin && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
                  aria-label="Manage expense options"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Popover Action Cards List Frame Overlay */}
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#EFE9DC] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => { onEdit?.(expense); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-[#FAF8F5] hover:text-[#2D6A4F] transition-colors text-left"
                    >
                      <Edit2 size={13} />
                      <span>Modify Details</span>
                    </button>
                    
                    <button
                      onClick={() => { onDelete?.(expense); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-[#FAF8F5]"
                    >
                      <Trash2 size={13} />
                      <span>Void Ledger Item</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Standard Dismiss Trigger */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Core Metadata Financials Log Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white scrollbar-thin">
          
          {/* Main Statement Title & Grand Total Sheet block Card */}
          <div className="bg-[#FAF8F5] border border-[#EFE9DC]/60 rounded-2xl p-5 shadow-2xs text-center space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-[#EFE9DC] text-stone-400 px-2.5 py-0.5 rounded-md inline-block select-none">
              Financial Statement
            </span>
            <h3 className="text-base font-bold tracking-tight text-slate-800 max-w-xs mx-auto leading-snug break-words">
              {expense.title}
            </h3>
            <p className="text-3xl font-black text-[#2D6A4F] tracking-tight pt-0.5">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Optional Reference Notes Description Block */}
          {expense.notes && (
            <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
                <FileText size={13} /> Ledger Notes
              </h4>
              <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Payee Allocation Funding Splits Splits Grid Card */}
          <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
              <Coins size={13} /> Funding Allocations
            </h4>
            
            <div className="divide-y divide-[#FAF8F5] space-y-2.5 first:pt-0">
              {expense.payers?.map((payer) => (
                <div key={payer?.user?._id || Math.random()} className="flex items-center justify-between pt-2.5 first:pt-0 text-xs font-semibold">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0 select-none">
                      {payer?.user?.profilePicture ? (
                        <img src={payer.user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-stone-400">
                          {payer?.user?.name?.[0] || "U"}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-700 truncate">{payer?.user?.name || "Group Traveler"}</span>
                  </div>
                  <span className="text-slate-800 font-extrabold flex-shrink-0 pl-2">
                    ₹{(Number(payer?.amount) || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Split Beneficiaries Capsules Badges Block */}
          <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs space-y-3.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
              <Users size={13} /> Split Beneficiaries
            </h4>
            
            <div className="flex flex-wrap gap-1.5">
              {expense.participants?.map((participant) => (
                <span
                  key={participant?._id}
                  className="text-[10px] font-bold text-stone-500 bg-[#FAF8F5] border border-[#EFE9DC] px-2.5 py-1 rounded-md shadow-2xs select-none"
                >
                  {participant?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Audit Trail Logging Histories Card */}
          <div className="bg-white border border-[#EFE9DC] rounded-2xl p-5 shadow-2xs divide-y divide-[#FAF8F5] space-y-3 select-none">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0">
                {expense.createdBy?.profilePicture ? (
                  <img src={expense.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] font-bold uppercase text-stone-400">{expense.createdBy?.name?.[0]}</span>
                )}
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none mb-1">
                  Logged By
                </p>
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {expense.createdBy?.name || "Traveler"}
                </p>
              </div>
            </div>

            {expense.updatedBy && (
              <div className="flex items-center gap-3 pt-3 animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0">
                  {expense.updatedBy?.profilePicture ? (
                    <img src={expense.updatedBy.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] font-bold uppercase text-stone-400">{expense.updatedBy?.name?.[0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none mb-1">
                    Audited By
                  </p>
                  <p className="text-xs font-bold text-slate-800 leading-none">
                    {expense.updatedBy?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </motion.div>
    </div>,
    document.body
  );
};

export default ExpenseDrawer;