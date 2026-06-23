import { useState, useEffect, useRef } from "react";
import { expenseService } from "../../../services/expenseService";
import { theme } from "../../../common/common";
import Spinner from "../../common/Spinner";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Edit3, Wallet, Users, Coins, Plus, AlertCircle, FileText, ChevronDown, CheckSquare, Square, X } from "lucide-react";

const EditExpenseModal = ({ open, onClose, expense, trip, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Custom Dropdown Open/Close Toggle Indexes
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);
  const [activePayerDropdownIdx, setActivePayerDropdownIdx] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    payers: [{ user: "", userName: "Select Crew Member", amount: "" }],
    participants: [],
  });

  // Synchronize dynamic inputs and pre-populate existing data arrays when focused expense changes
  useEffect(() => {
    if (!open || !expense) return;

    // Deep trace sub-document payloads to read raw IDs or direct sub-document references safely
    const initialPayers = expense.payers?.map((p) => {
      const uId = p.user?._id || p.user;
      const matchedMember = trip?.members?.find((m) => String(m._id) === String(uId));
      return {
        user: uId || "",
        userName: matchedMember?.name || "Select Crew Member",
        amount: String(p.amount || ""),
      };
    }) || [{ user: "", userName: "Select Crew Member", amount: "" }];

    const initialParticipants = expense.participants?.map((p) => p._id || p) || [];

    setFormData({
      title: expense.title || "",
      notes: expense.notes || "",
      payers: initialPayers.length > 0 ? initialPayers : [{ user: "", userName: "Select Crew Member", amount: "" }],
      participants: initialParticipants,
    });

    setErrors({});
    setShowParticipantsDropdown(false);
    setActivePayerDropdownIdx(null);
  }, [open, expense, trip]);

  // Handle clicking outside custom dropdown sheets to close them safely
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".participants-wrapper")) {
        setShowParticipantsDropdown(false);
      }
      if (!e.target.closest(".payer-dropdown-wrapper")) {
        setActivePayerDropdownIdx(null);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Handle Escape key modal closure shortcuts safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleCloseWrapper();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const updatePayerValue = (index, field, value) => {
    const updatedPayers = [...formData.payers];
    if (updatedPayers[index]) {
      updatedPayers[index][field] = value;
      setFormData((prev) => ({ ...prev, payers: updatedPayers }));
    }
  };

  const selectPayerUser = (index, userId, userName) => {
    const updatedPayers = [...formData.payers];
    if (updatedPayers[index]) {
      updatedPayers[index].user = userId;
      updatedPayers[index].userName = userName;
      setFormData((prev) => ({ ...prev, payers: updatedPayers }));
    }
    setActivePayerDropdownIdx(null);
  };

  const addPayer = () => {
    setFormData((prev) => ({
      ...prev,
      payers: [...prev.payers, { user: "", userName: "Select Crew Member", amount: "" }],
    }));
  };

  const removePayer = (index) => {
    if (formData.payers.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      payers: prev.payers.filter((_, idx) => idx !== index),
    }));
  };

  const toggleParticipant = (userId) => {
    setFormData((prev) => {
      const exists = prev.participants.includes(userId);
      const updatedParticipants = exists
        ? prev.participants.filter((id) => id !== userId)
        : [...prev.participants, userId];
      
      return { ...prev, participants: updatedParticipants };
    });

    if (errors.participants) {
      setErrors((prev) => ({ ...prev, participants: "" }));
    }
  };

  const selectAllParticipants = () => {
    const allIds = (trip?.members || []).map(m => m._id);
    setFormData(prev => ({ ...prev, participants: allIds }));
    if (errors.participants) setErrors(prev => ({ ...prev, participants: "" }));
  };

  const clearAllParticipants = () => {
    setFormData(prev => ({ ...prev, participants: [] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Expense name is required";
    }
    if (formData.participants.length === 0) {
      newErrors.participants = "Select at least one beneficiary split user";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      
      const validPayers = formData.payers
        .filter((p) => p.user && p.amount.trim())
        .map((p) => ({
          user: p.user,
          amount: parseFloat(p.amount.replace(/[^0-9.]/g, "")) || 0,
        }));

      await expenseService.updateExpense({
        expenseId: expense._id,
        title: formData.title.trim(),
        notes: formData.notes.trim(),
        payers: validPayers,
        participants: formData.participants,
      });

      await onUpdated();
      handleCloseWrapper();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWrapper = () => {
    setErrors({});
    setShowParticipantsDropdown(false);
    setActivePayerDropdownIdx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Overlay Backdrop */}
      <div onClick={handleCloseWrapper} className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity" />

      {/* Main Structural Modal Content Layout Box - Pure White Base */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] flex flex-col max-h-[85vh] z-10 font-sans antialiased text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Absolute Close shortcut Trigger */}
        <button
          type="button"
          onClick={handleCloseWrapper}
          className="absolute right-6 top-6 p-2 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
        >
          <X size={16} />
        </button>

        {/* Modal Header Section */}
        <div className="p-6 md:p-8 pb-4 border-b border-[#F5F0E6] select-none flex-shrink-0">
          <div className="flex items-center gap-2 text-[#2D6A4F] mb-1">
            <Edit3 size={18} />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Modify Expense Details
            </h2>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Adjust ledger labels, reference logs values, or rectify dynamic splits records instantly across your ledger.
          </p>
        </div>

        {/* Scrollable Core Fields Segment Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 scrollbar-thin">
          
          {/* Section 1: Descriptors */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Expense Description
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Beach resort stay or Jewelleries split"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all ${
                  errors.title ? "border-rose-300 focus:border-rose-400" : "border-[#EFE9DC]"
                }`}
              />
              {errors.title && (
                <p className="text-rose-600 text-[11px] font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <FileText size={13} className="text-stone-400" /> Reference Notes <span className="text-stone-400 normal-case font-medium ml-0.5">(Optional)</span>
              </label>
              <textarea
                name="notes"
                placeholder="Modify receipts details, change notes context guidelines..."
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] resize-none font-medium transition-all"
              />
            </div>
          </div>

          {/* Section 2: Payer Details Dropdowns */}
          <div className="space-y-3 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
              <Coins size={13} className="text-stone-400" /> Payer Details
            </label>
            
            <div className="space-y-2.5">
              {formData.payers.map((payer, index) => (
                <div key={index} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-100 relative payer-dropdown-wrapper">
                  
                  {/* Payer Selector Input Field Trigger Box */}
                  <div className="flex-1 relative">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePayerDropdownIdx(activePayerDropdownIdx === index ? null : index);
                        setShowParticipantsDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition-all hover:bg-stone-50"
                      style={{ minHeight: "40px" }}
                    >
                      <span className={payer.user ? "text-slate-800" : "text-stone-400"}>{payer.userName}</span>
                      <ChevronDown size={14} className="text-stone-400 flex-shrink-0 pl-1" />
                    </button>

                    {/* Popover choice layout menu container */}
                    {activePayerDropdownIdx === index && (
                      <div className="absolute left-0 mt-1.5 w-full bg-white border border-[#EFE9DC] rounded-xl shadow-xl max-h-40 overflow-y-auto py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                        {(trip?.members || []).map((member) => (
                          <button
                            type="button"
                            key={member._id}
                            onClick={() => selectPayerUser(index, member._id, member.name)}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-[#FAF8F5] hover:text-[#2D6A4F] transition-colors"
                          >
                            {member.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clean String Mask Input Amount Wrapper */}
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Amount (₹)"
                    value={payer.amount}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/[^0-9.]/g, "");
                      updatePayerValue(index, "amount", cleanVal);
                    }}
                    className="w-36 px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-extrabold text-slate-800 outline-none placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all"
                  />

                  {formData.payers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePayer(index)}
                      className="p-2 text-stone-300 hover:text-rose-600 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPayer}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] bg-[#FAF8F5] border border-[#EFE9DC] px-3 py-1.5 rounded-xl transition-all shadow-2xs mt-1 select-none"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Split multiple payers</span>
            </button>
          </div>

          {/* Section 3: Shared Participants Checkbox Matrix */}
          <div className="space-y-1.5 pt-1 relative participants-wrapper">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
              <Users size={13} className="text-stone-400" /> Split Beneficiaries
            </label>

            <button
              type="button"
              onClick={() => {
                setShowParticipantsDropdown(!showParticipantsDropdown);
                setActivePayerDropdownIdx(null);
              }}
              className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-between transition-all hover:bg-stone-50 ${
                errors.participants ? "border-rose-300" : "border-[#EFE9DC]"
              }`}
              style={{ minHeight: "42px" }}
            >
              <span className={formData.participants.length > 0 ? "text-slate-800" : "text-stone-400"}>
                {formData.participants.length === 0 
                  ? "Select who shares this bill..." 
                  : `${formData.participants.length} Crew members selected`}
              </span>
              <ChevronDown size={14} className="text-stone-400" />
            </button>

            {/* Dropdown Options Box overlay layer */}
            {showParticipantsDropdown && (
              <div className="absolute left-0 mt-1.5 w-full bg-white border border-[#EFE9DC] rounded-xl shadow-xl z-30 flex flex-col max-h-56 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-[#FAF8F5] bg-[#FAF8F5]/50 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-wider select-none">
                  <button type="button" onClick={selectAllParticipants} className="text-[#2D6A4F] hover:underline">Select All</button>
                  <button type="button" onClick={clearAllParticipants} className="text-stone-400 hover:underline">Clear Selection</button>
                </div>

                <div className="overflow-y-auto py-1 divide-y divide-[#FAF8F5] scrollbar-thin">
                  {(trip?.members || []).map((member) => {
                    const isChecked = formData.participants.includes(member._id);
                    return (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => toggleParticipant(member._id)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-[#FAF8F5] transition-colors group"
                      >
                        <span className={`transition-colors ${isChecked ? "text-[#2D6A4F]" : "text-slate-700"}`}>
                          {member.name}
                        </span>
                        <div className={`transition-colors ${isChecked ? "text-[#2D6A4F]" : "text-stone-300 group-hover:text-stone-400"}`}>
                          {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {errors.participants && (
              <p className="text-rose-600 text-[11px] font-semibold flex items-center gap-1 pt-1">
                <AlertCircle size={12} /> {errors.participants}
              </p>
            )}
          </div>

          {/* Action Row Toolbar Controls Footer Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F5F0E6] mt-6 select-none flex-shrink-0">
            <button
              type="button"
              onClick={handleCloseWrapper}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || formData.participants.length === 0}
              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Saving Changes...</span>
                </div>
              ) : (
                "Update Expense"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;