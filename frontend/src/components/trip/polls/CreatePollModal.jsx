import { useState } from "react";
import { pollService } from "../../../services/pollService";
import { theme } from "../../../common/common";

// Premium minimalistic vectors matching our corporate design identity ✨
import { BarChart3, Plus, X, Trash2, HelpCircle, CheckSquare, Square } from "lucide-react";

const CreatePollModal = ({ open, trip, onClose, onCreated }) => {
  const [question, setQuestion] = useState("");
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [options, setOptions] = useState(["", ""]);
  const [
  expiresAt,
  setExpiresAt
] = useState("");

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const createPoll = async (e) => {
    e.preventDefault();

    // Prevent submitting empty forms
    const validOptions = options.filter((option) => option.trim() !== "");
    if (!question.trim() || validOptions.length < 2) return;

    try {
     await pollService.createPoll({
  tripId: trip._id,
  question: question.trim(),
  options: validOptions,
  allowMultipleVotes,
  expiresAt:
    expiresAt || null
});

      onCreated();
      resetForm();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOptionField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionField = (index) => {
    if (options.length <= 2) return; // Maintain minimum of two options
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const resetForm = () => {
    setQuestion("");
    setAllowMultipleVotes(false);
    setOptions(["", ""]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Overlay Backdrop */}
      <div 
        onClick={handleClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" 
      />

      {/* Main Structural Modal Layout Box */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] z-10 font-sans antialiased animate-in fade-in zoom-in-95 duration-150">
        
        {/* Absolute Close Shortcut Trigger Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header Container Block */}
        <div className="p-6 md:p-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#1E4631]">
            <BarChart3 size={20} />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Create Group Poll
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Help your crew make coordinated travel decisions seamlessly. Gather anonymous or flexible choices.
          </p>
        </div>

        {/* Scrollable Core Interactive Form Component */}
        <form onSubmit={createPoll} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
          
          {/* Question Input Wrapper */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <HelpCircle size={13} /> Poll Topic Question
            </label>
            <input
              type="text"
              placeholder="e.g., Where should we go for Friday dinner?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-800 placeholder-gray-400`}
              required
            />
          </div>

          {/* Dynamic Voting Options Collection List Area */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Response Options
            </label>
            
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 group animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={option}
                    placeholder={`Option ${index + 1}`}
                    onChange={(e) => handleOptionChange(e.target.value, index)}
                    className="w-full px-4 py-2.5 bg-gray-50/30 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] outline-none text-gray-800 placeholder-gray-400"
                    required={index < 2} // Require at least first two choices
                  />
                </div>
                
                {/* Trash option clean dynamic toggle button conditional frame */}
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOptionField(index)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all flex-shrink-0"
                    title="Remove choice"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            {/* Append option click drawer line link trigger */}
            <button
              type="button"
              onClick={addOptionField}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1E4631] hover:text-[#153122] bg-[#1E4631]/5 hover:bg-[#1E4631]/10 px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Add custom choice</span>
            </button>
          </div>

          {/* Premium Modular Custom Option Toggle Checkbox Panel Row */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setAllowMultipleVotes(!allowMultipleVotes)}
              className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 select-none hover:text-gray-900 group transition-colors focus:outline-none"
            >
              <div className="text-[#1E4631] transition-transform active:scale-90 duration-100">
                {allowMultipleVotes ? (
                  <CheckSquare size={18} className="animate-in zoom-in-75 duration-100" />
                ) : (
                  <Square size={18} className="text-gray-300 group-hover:text-gray-400" />
                )}
              </div>
              <span>Allow participants to select multiple answers</span>
            </button>
          </div>

          <div className="space-y-1.5">
  <label
    className="
    text-[11px]
    font-bold
    uppercase
    tracking-wider
    text-gray-400
    "
  >
    Poll End Time (Optional)
  </label>

  <input
    type="datetime-local"
    value={expiresAt}
    onChange={(e) =>
      setExpiresAt(
        e.target.value
      )
    }
    className="
    w-full
    px-4
    py-3
    bg-gray-50/50
    border
    border-gray-200
    rounded-xl
    text-sm
    "
  />
</div>

          {/* Footer Navigation CTA Elements Separator Line Row */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!question.trim() || options.filter(o => o.trim() !== "").length < 2}
              className="bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              Publish Poll
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePollModal;