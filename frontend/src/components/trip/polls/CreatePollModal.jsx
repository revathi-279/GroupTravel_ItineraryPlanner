import { useState, useEffect, useRef } from "react";
import { pollService } from "../../../services/pollService";
import { theme } from "../../../common/common";

// Premium minimalistic vectors matching our corporate design identity ✨
import { BarChart3, Plus, X, Trash2, HelpCircle, CheckSquare, Square, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const CreatePollModal = ({ open, trip, onClose, onCreated }) => {
  const [question, setQuestion] = useState("");
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [options, setOptions] = useState(["", ""]);
  
  // Split Custom picker state registers
  const [selectedDate, setSelectedDate] = useState(null); // Date Object
  const [selectedTime, setSelectedTime] = useState({ hour: "12", minute: "00", period: "PM" });
  const [dateText, setDateText] = useState("");
  const [timeText, setTimeText] = useState("12:00 PM");

  // Picker popup visibility tracking states
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Internal calendar browsing focus state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const handleOutsideDropdownClick = (e) => {
      if (!e.target.closest(".custom-calendar-wrapper")) {
        setShowCalendar(false);
      }
      if (!e.target.closest(".custom-time-wrapper")) {
        setShowTimePicker(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideDropdownClick);
    return () => document.removeEventListener("mousedown", handleOutsideDropdownClick);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Build dynamic internal grid array for custom calendar picker
  const calendarDays = (() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    // Pad empty slots matching initial weekday spacing row gaps
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      daysArray.push(new Date(year, month, day));
    }
    return daysArray;
  })();

  const selectCalendarDate = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setDateText(date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }));
    setShowCalendar(false);
  };

  const selectTimeValue = (field, value) => {
    const updatedTime = { ...selectedTime, [field]: value };
    setSelectedTime(updatedTime);
    setTimeText(`${updatedTime.hour}:${updatedTime.minute} ${updatedTime.period}`);
  };

  const createPoll = async (e) => {
    e.preventDefault();

    const validOptions = options.filter((option) => option.trim() !== "");
    if (!question.trim() || validOptions.length < 2) return;

    // Merge custom pickers inputs into an ISO datetime string cleanly
    let finalExpiryISO = null;
    if (selectedDate) {
      let numericalHour = parseInt(selectedTime.hour);
      if (selectedTime.period === "PM" && numericalHour !== 12) numericalHour += 12;
      if (selectedTime.period === "AM" && numericalHour === 12) numericalHour = 0;

      const mergedTimestamp = new Date(selectedDate);
      mergedTimestamp.setHours(numericalHour, parseInt(selectedTime.minute), 0, 0);
      finalExpiryISO = mergedTimestamp.toISOString();
    }

    try {
      await pollService.createPoll({
        tripId: trip._id,
        question: question.trim(),
        options: validOptions,
        allowMultipleVotes,
        expiresAt: finalExpiryISO
      });

      onCreated();
      handleClose();
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
    if (options.length <= 2) return;
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
  };

  const resetForm = () => {
    setQuestion("");
    setAllowMultipleVotes(false);
    setOptions(["", ""]);
    setSelectedDate(null);
    setSelectedTime({ hour: "12", minute: "00", period: "PM" });
    setDateText("");
    setTimeText("12:00 PM");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={handleClose} className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity duration-200" />

      {/* Main Content Layout Frame Box */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] flex flex-col max-h-[85vh] z-10 font-sans antialiased text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-6 top-6 p-2 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
        >
          <X size={16} />
        </button>

        <div className="p-6 md:p-8 pb-4 border-b border-[#F5F0E6] select-none">
          <div className="flex items-center gap-2 text-[#2D6A4F]">
            <BarChart3 size={20} />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Create Group Poll
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
            Help your crew make coordinated travel decisions seamlessly. Gather clear and flexible group choices.
          </p>
        </div>

        <form onSubmit={createPoll} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 scrollbar-thin">
          
          {/* Question Input Field wrapper */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
              <HelpCircle size={13} /> Poll Topic Question
            </label>
            <input
              type="text"
              placeholder="e.g., Where should we go for dinner tonight?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all font-medium"
              required
            />
          </div>

          {/* Dynamic Response Options stack list */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1 select-none">
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
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all"
                    required={index < 2}
                  />
                </div>
                
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOptionField(index)}
                    className="p-2.5 text-stone-400 hover:text-rose-600 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addOptionField}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] bg-[#FAF8F5] border border-[#EFE9DC] px-3 py-1.5 rounded-xl transition-all shadow-2xs mt-1 select-none"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Add custom choice</span>
            </button>
          </div>

          {/* Multi votes allow checkbox selection row */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setAllowMultipleVotes(!allowMultipleVotes)}
              className="flex items-center gap-2.5 text-xs font-semibold text-stone-500 select-none hover:text-slate-800 group transition-colors focus:outline-none"
            >
              <div className="text-[#2D6A4F] transition-transform active:scale-90 duration-100">
                {allowMultipleVotes ? (
                  <CheckSquare size={18} className="animate-in zoom-in-75 duration-100" />
                ) : (
                  <Square size={18} className="text-stone-300 group-hover:text-stone-400" />
                )}
              </div>
              <span>Allow participants to select multiple answers</span>
            </button>
          </div>

          {/* Split Custom Picking Fields Matrix Layout Row */}
          <div className="grid grid-cols-2 gap-4 pt-1 select-none">
            
            {/* Custom Field Segment A: Dropdown Calendar Picker Wrapper */}
            <div className="space-y-1.5 relative custom-calendar-wrapper">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Calendar size={13} /> Expiry Date <span className="text-[10px] normal-case font-medium text-stone-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  placeholder="Set Date Deadline..."
                  value={dateText}
                  onClick={() => { setShowCalendar(!showCalendar); setShowTimePicker(false); }}
                  className="w-full pl-4 pr-10 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-[#2D6A4F] transition-all"
                />
                <Calendar size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>

              {/* Custom Dropdown Calendar Sheet Popover Overlay Block */}
              {showCalendar && (
                <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-[#EFE9DC] rounded-2xl shadow-xl p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-[#FAF8F5] mb-2">
                    <span>{currentMonth.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
                    <div className="flex gap-1 text-stone-400">
                      <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 hover:text-slate-800"><ChevronLeft size={14} /></button>
                      <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 hover:text-slate-800"><ChevronRight size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => (
                      <button
                        type="button"
                        key={idx}
                        disabled={!day}
                        onClick={() => selectCalendarDate(day)}
                        className={`p-1.5 text-[11px] font-bold rounded-lg text-center ${
                          !day ? "pointer-events-none opacity-0" :
                          selectedDate && day.toDateString() === selectedDate.toDateString()
                            ? "bg-[#2D6A4F] text-white"
                            : "text-slate-700 hover:bg-[#FAF8F5] hover:text-[#2D6A4F]"
                        }`}
                      >
                        {day?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Field Segment B: Time Scroller Picker Picker Wrapper */}
            <div className="space-y-1.5 relative custom-time-wrapper">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Clock size={13} /> Expiry Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled={!selectedDate}
                  placeholder="12:00 PM"
                  value={timeText}
                  onClick={() => { if (selectedDate) setShowTimePicker(!showTimePicker); setShowCalendar(false); }}
                  className="w-full pl-4 pr-10 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-[#2D6A4F] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <Clock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>

              {/* Custom Segmented Time Choice dropdown box popover Sheet */}
              {showTimePicker && selectedDate && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#EFE9DC] rounded-2xl shadow-xl p-3 z-30 flex gap-3 h-44 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Hours Selection Column */}
                  <div className="flex-1 flex flex-col overflow-y-auto divide-y divide-[#FAF8F5] scrollbar-none text-center">
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(h => (
                      <button type="button" key={h} onClick={() => selectTimeValue("hour", h)} className={`py-1 text-xs font-bold block ${selectedTime.hour === h ? "text-[#2D6A4F] bg-[#E9F5ED]" : "text-slate-600 hover:bg-[#FAF8F5]"}`}>{h}</button>
                    ))}
                  </div>
                  {/* Minutes Selection Column */}
                  <div className="flex-1 flex flex-col overflow-y-auto divide-y divide-[#FAF8F5] scrollbar-none text-center">
                    {["00", "15", "30", "45"].map(m => (
                      <button type="button" key={m} onClick={() => selectTimeValue("minute", m)} className={`py-1 text-xs font-bold block ${selectedTime.minute === m ? "text-[#2D6A4F] bg-[#E9F5ED]" : "text-slate-600 hover:bg-[#FAF8F5]"}`}>{m}</button>
                    ))}
                  </div>
                  {/* AM/PM Shift Toggle Selector Column */}
                  <div className="flex flex-col gap-1 justify-center border-l border-[#FAF8F5] pl-2 text-center select-none flex-shrink-0">
                    {["AM", "PM"].map(p => (
                      <button type="button" key={p} onClick={() => selectTimeValue("period", p)} className={`px-2 py-1 text-[10px] font-black rounded-lg border ${selectedTime.period === p ? "bg-[#2D6A4F] text-white border-[#2D6A4F]" : "border-[#EFE9DC] text-stone-500 hover:bg-[#FAF8F5]"}`}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Footer controls section buttons toolbar row */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F5F0E6] mt-6 select-none flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!question.trim() || options.filter(o => o.trim() !== "").length < 2}
              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
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