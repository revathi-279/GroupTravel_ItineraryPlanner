import { theme } from "../../common/common";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  variant = "danger",
  loading = false,
}) => {

  if (!open) {
    return null;
  }

  // Determine button color schema depending on the dialog intent variant style
  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-xs flex items-center justify-center p-4">
      
      {/* Absolute overlay boundary mapping handler to block external layer leakages */}
      <div onClick={onClose} className="absolute inset-0 w-full h-full" />

      {/* Main Card Frame Body - Pure White Base */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] p-6 md:p-8 z-10 font-sans antialiased text-slate-900 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Optional Header Icon Tracker for Danger Actions */}
        {isDanger && (
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-500">
            <AlertTriangle size={18} />
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2 select-none">
          {title}
        </h2>

        <p className="text-sm text-stone-500 mb-6 leading-relaxed font-medium">
          {message}
        </p>

        {/* Dual Actions Controls Track */}
        <div className="flex gap-3">
          
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white hover:bg-stone-50 border border-[#EFE9DC] text-stone-500 hover:text-slate-800 rounded-xl text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`flex-1 py-3 text-white rounded-xl text-sm font-semibold tracking-wide transition-all active:scale-[0.98] disabled:opacity-70 ${
              isDanger
                ? "bg-gradient-to-r from-rose-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F]"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationModal;