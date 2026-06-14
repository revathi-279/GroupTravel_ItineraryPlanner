import { useState, useEffect } from "react";
import { expenseService } from "../../../services/expenseService";
import { theme } from "../../../common/common";
import Spinner from "../../common/Spinner";

// Premium minimalistic vectors matching our corporate design identity ✨
import { X, Wallet, Users, Coins, Plus, AlertCircle, FileText } from "lucide-react";

const CreateExpenseModal = ({ open, onClose, trip, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    payers: [{ user: "", amount: "" }],
    participants: [],
  });

  // Synchronize dynamic fields and reset validations when opening state flags toggle
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        notes: "",
        payers: [{ user: "", amount: "" }],
        participants: [],
      });
      setErrors({});
    }
  }, [open]);

  // Handle Escape key modal closure shortcuts safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const updatePayer = (index, field, value) => {
    const updatedPayers = [...formData.payers];
    if (updatedPayers[index]) {
      updatedPayers[index][field] = value;
      setFormData((prev) => ({
        ...prev,
        payers: updatedPayers,
      }));
    }
  };

  const addPayer = () => {
    setFormData((prev) => ({
      ...prev,
      payers: [...prev.payers, { user: "", amount: "" }],
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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Expense name tracking descriptor is required";
    }
    if (formData.participants.length === 0) {
      newErrors.participants = "Select at least one participant sharing this expense payload";
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
      
      // Sanitize payers to filter out incomplete fields and convert numerical objects safely
      const validPayers = formData.payers
        .filter((p) => p.user && p.amount)
        .map((p) => ({
          user: p.user,
          amount: Number(p.amount) || 0,
        }));

      await expenseService.addExpense({
        tripId: trip._id,
        title: formData.title.trim(),
        notes: formData.notes.trim(),
        payers: validPayers.length > 0 ? validPayers : [],
        participants: formData.participants,
      });

      await onCreated();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Overlay Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Main Structural Modal Content Layout Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] z-10 font-sans antialiased text-gray-900 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Absolute Top-Right Close Shortcut Action Trigger Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header Typography Block */}
        <div className="p-6 md:p-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#1E4631] mb-1">
            <Wallet size={18} />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Add shared Expense
            </h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Log bills, accommodation invoices, or ticket values to balance accounts across your trip group cleanly.
          </p>
        </div>

        {/* Scrollable Dynamic Form Component */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Section 1: Core Bill Identifiers */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Expense Description
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Beach resort stay or Fuel refill"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-800 placeholder-gray-400 ${
                  errors.title ? "border-red-300 focus:border-red-400" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FileText size={13} className="text-gray-400" /> Reference Notes <span className="text-gray-400 normal-case font-normal ml-0.5">(Optional)</span>
              </label>
              <textarea
                name="notes"
                placeholder="Add split notes, payment vendor data, or ledger instructions..."
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Payer Allocations Track */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Coins size={13} className="text-gray-400" /> Payer Details
            </label>
            
            <div className="space-y-2.5">
              {formData.payers.map((payer, index) => (
                <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-100">
                  <select
                    value={payer.user}
                    onChange={(e) => updatePayer(index, "user", e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:bg-white focus:border-[#1E4631] outline-none"
                  >
                    <option value="">Select Crew Member</option>
                    {(trip?.members || []).map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="any"
                    placeholder="Amount Paid (₹)"
                    value={payer.amount}
                    onChange={(e) => updatePayer(index, "amount", e.target.value)}
                    className="w-40 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#1E4631] outline-none placeholder-gray-400"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPayer}
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#1E4631] hover:text-[#153122] bg-[#1E4631]/5 hover:bg-[#1E4631]/10 px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Add another payer splitting</span>
            </button>
          </div>

          {/* Section 3: Shared Participants Grid Selectors */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Users size={13} className="text-gray-400" /> Split Beneficiaries (Who is sharing this bill?)
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(trip?.members || []).map((member) => {
                const isChecked = formData.participants.includes(member._id);
                return (
                  <div
                    key={member._id}
                    onClick={() => toggleParticipant(member._id)}
                    className={`p-3 rounded-xl border text-xs font-bold tracking-tight text-center transition-all cursor-pointer select-none ${
                      isChecked
                        ? "border-[#1E4631] bg-[#1E4631]/[0.02] text-[#1E4631]"
                        : "border-gray-200 bg-gray-50/30 text-gray-600 hover:border-gray-300 hover:bg-gray-50/60"
                    }`}
                  >
                    {member.name}
                  </div>
                );
              })}
            </div>
            
            {errors.participants && (
              <p className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-1.5">
                <AlertCircle size={12} /> {errors.participants}
              </p>
            )}
          </div>

          {/* Footer Interactive Actions Utility Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || formData.participants.length === 0}
              className="bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-1.5">
                  <Spinner />
                  <span>Logging Sheet...</span>
                </div>
              ) : (
                "Create Expense"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateExpenseModal;