import { useEffect, useRef, useState } from "react";
import { theme } from "../../common/common";
import { tripService } from "../../services/tripService";
import Spinner from "../common/Spinner";
import { X, Calendar, MapPin, Type, AlignLeft, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const CreateTripModal = ({ open, onClose, onTripCreated }) => {
  const modalRef = useRef(null);
  const startCalendarRef = useRef(null);
  const endCalendarRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: "", 
    endDate: "",   
  });

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleMonthChange = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const handleDateSelect = (day, field) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const offset = selectedDate.getTimezoneOffset();
    const formattedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

    setFormData({ ...formData, [field]: formattedDate });
    if (field === "startDate") setShowStartCalendar(false);
    if (field === "endDate") setShowEndCalendar(false);

    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  useEffect(() => {
    const handleOutsideCalendarClick = (e) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(e.target)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(e.target)) {
        setShowEndCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideCalendarClick);
    return () => document.removeEventListener("mousedown", handleOutsideCalendarClick);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && !showStartCalendar && !showEndCalendar) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, onClose, showStartCalendar, showEndCalendar]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = "Trip title is required";
    if (!formData.destination.trim()) validationErrors.destination = "Destination is required";
    if (!formData.startDate) validationErrors.startDate = "Start date is required";
    if (!formData.endDate) validationErrors.endDate = "End date is required";

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      validationErrors.endDate = "End date must be after start date";
    }
    return validationErrors;
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
      const response = await tripService.createTrip(formData);
      onTripCreated(response.trip);
      onClose();
      setFormData({ title: "", destination: "", description: "", startDate: "", endDate: "" });
      setErrors({});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCalendarDropdown = (field, currentSelectedValue) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentMonth);
    const blankDays = Array(firstDayIndex).fill(null);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allGridItems = [...blankDays, ...daysArray];

    return (
      <div className="absolute left-0 mt-2 z-50 w-72 bg-white rounded-2xl border border-[#EFE9DC] shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-stone-50 rounded-lg text-stone-500">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-slate-700 tracking-wide">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button type="button" onClick={() => handleMonthChange(1)} className="p-1 hover:bg-stone-50 rounded-lg text-stone-500">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {DAYS_OF_WEEK.map((day) => (
            <span key={day} className="text-[10px] font-bold text-stone-400 uppercase">{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {allGridItems.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            
            const targetDateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              .toISOString().split('T')[0];
            const isSelected = currentSelectedValue === targetDateStr;

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={() => handleDateSelect(day, field)}
                className={`h-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all ${
                  isSelected 
                    ? "bg-[#2D6A4F] text-white font-bold shadow-xs" 
                    : "text-slate-600 hover:bg-stone-50 hover:text-slate-900"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Restored exact original bounding frame wrapper */}
      <div ref={modalRef} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] p-6 md:p-8 font-sans antialiased">
        
        <button onClick={onClose} className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all">
          <X size={18} />
        </button>

        <div className="mb-6 pr-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Create New Journey
          </h2>
          <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
            Start planning your next adventure. Invite friends, organize plans, and travel seamlessly together.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input: Journey Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Type size={13} /> Journey Name
            </label>
            <input
              name="title"
              placeholder="e.g., Spring Break Extravaganza"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#FAF8F5] border rounded-xl text-sm transition-all focus:bg-white outline-none ${
                errors.title ? "border-rose-200 focus:border-rose-400 bg-rose-50/30" : "border-[#EFE9DC] focus:border-[#2D6A4F]"
              }`}
            />
            {errors.title && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          {/* Input: Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <MapPin size={13} /> Destination
            </label>
            <input
              name="destination"
              placeholder="e.g., Kyoto, Japan"
              value={formData.destination}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#FAF8F5] border rounded-xl text-sm transition-all focus:bg-white outline-none ${
                errors.destination ? "border-rose-200 focus:border-rose-400 bg-rose-50/30" : "border-[#EFE9DC] focus:border-[#2D6A4F]"
              }`}
            />
            {errors.destination && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.destination}
              </p>
            )}
          </div>

          {/* Input Row: Travel Dates */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Calendar size={13} /> Travel Dates
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Start Date */}
              <div ref={startCalendarRef} className="flex-1 space-y-1 relative">
                <span className="text-[11px] font-semibold text-stone-400 block">Start Date</span>
                <button
                  type="button"
                  onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm text-left transition-all hover:bg-white ${
                    errors.startDate ? "border-rose-200 bg-rose-50/30" : "border-[#EFE9DC] focus:border-[#2D6A4F]"
                  } ${formData.startDate ? "text-slate-800" : "text-stone-400"}`}
                >
                  <span>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Select date"}</span>
                  <Calendar size={14} className="text-stone-400" />
                </button>
                {showStartCalendar && renderCalendarDropdown("startDate", formData.startDate)}
              </div>

              {/* End Date */}
              <div ref={endCalendarRef} className="flex-1 space-y-1 relative">
                <span className="text-[11px] font-semibold text-stone-400 block">End Date</span>
                <button
                  type="button"
                  onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm text-left transition-all hover:bg-white ${
                    errors.endDate ? "border-rose-200 bg-rose-50/30" : "border-[#EFE9DC] focus:border-[#2D6A4F]"
                  } ${formData.endDate ? "text-slate-800" : "text-stone-400"}`}
                >
                  <span>{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : "Select date"}</span>
                  <Calendar size={14} className="text-stone-400" />
                </button>
                {showEndCalendar && renderCalendarDropdown("endDate", formData.endDate)}
              </div>

            </div>
            
            {(errors.startDate || errors.endDate) && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.startDate || errors.endDate}
              </p>
            )}
          </div>

          {/* Input: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <AlignLeft size={13} /> Description <span className="text-stone-400 normal-case font-normal ml-0.5">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="What's the vibe of this trip? Mention itinerary milestones..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm transition-all focus:bg-white focus:border-[#2D6A4F] resize-none outline-none"
            />
          </div>

          {/* Submission CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-70 shadow-xs"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner /> <span>Creating Journey...</span>
                </div>
              ) : (
                "Create Journey"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;