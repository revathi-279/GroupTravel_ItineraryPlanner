import { useEffect, useRef, useState } from "react";
import { theme } from "../../common/common";
import { tripService } from "../../services/tripService";
import Spinner from "../common/Spinner";
import { X, Calendar, MapPin, Type, AlignLeft, ChevronLeft, ChevronRight } from "lucide-react";

const CreateTripModal = ({ open, onClose, onTripCreated }) => {
  const modalRef = useRef(null);
  const startCalendarRef = useRef(null);
  const endCalendarRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Custom states to handle interactive calendar displays
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: "", // stored as "YYYY-MM-DD"
    endDate: "",   // stored as "YYYY-MM-DD"
  });

  // Calendar Utility Helpers
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
    // Format to YYYY-MM-DD local string safely
    const offset = selectedDate.getTimezoneOffset();
    const formattedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

    setFormData({ ...formData, [field]: formattedDate });
    if (field === "startDate") setShowStartCalendar(false);
    if (field === "endDate") setShowEndCalendar(false);

    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  // Close custom selectors when clicking outside their bounding box
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

  // Standard component escape rules
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

  // Renders the standalone clean calendar picker frame
  const renderCalendarDropdown = (field, currentSelectedValue) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentMonth);
    const blankDays = Array(firstDayIndex).fill(null);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allGridItems = [...blankDays, ...daysArray];

    return (
      <div className="absolute left-0 mt-2 z-50 w-72 bg-white rounded-2xl border border-gray-100 shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Navigation Head */}
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-gray-700 tracking-wide">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button type="button" onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {DAYS_OF_WEEK.map((day) => (
            <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
          ))}
        </div>

        {/* Dynamic Days Grid */}
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
                    ? "bg-[#2F6F4E] text-white font-bold shadow-xs" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div ref={modalRef} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 font-sans antialiased">
        
        <button onClick={onClose} className="absolute right-5 top-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
          <X size={18} />
        </button>

        <div className="mb-6 pr-6">
          <h2 className={`${theme.typography.modalTitle} text-2xl font-bold text-gray-800 tracking-tight`}>
            Create New Journey
          </h2>
          <p className={`${theme.typography.modalSubtitle} text-sm text-gray-500 mt-1.5 leading-relaxed`}>
            Start planning your next adventure. Invite friends, organize plans, and travel seamlessly together.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input: Journey Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Type size={13} className="text-gray-400" /> Journey Name
            </label>
            <input
              name="title"
              placeholder="e.g., Spring Break Extravaganza"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#2F6F4E]/20 outline-none ${
                errors.title ? "border-red-400" : "border-gray-200 focus:border-[#2F6F4E]"
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs font-medium mt-1">{errors.title}</p>}
          </div>

          {/* Input: Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <MapPin size={13} className="text-gray-400" /> Destination
            </label>
            <input
              name="destination"
              placeholder="e.g., Kyoto, Japan"
              value={formData.destination}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#2F6F4E]/20 outline-none ${
                errors.destination ? "border-red-400" : "border-gray-200 focus:border-[#2F6F4E]"
              }`}
            />
            {errors.destination && <p className="text-red-500 text-xs font-medium mt-1">{errors.destination}</p>}
          </div>

          {/* Input Row: Interactive Custom Travel Dates Dropdowns */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" /> Travel Dates
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Start Date Component Wrapper */}
              <div ref={startCalendarRef} className="flex-1 space-y-1 relative">
                <span className="text-[11px] font-semibold text-gray-400 block">Start Date</span>
                <button
                  type="button"
                  onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-left transition-all hover:bg-white ${
                    errors.startDate ? "border-red-400" : "border-gray-200 focus:border-[#2F6F4E]"
                  } ${formData.startDate ? "text-gray-800" : "text-gray-400"}`}
                >
                  <span>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Select date"}</span>
                  <Calendar size={14} className="text-gray-400" />
                </button>
                {showStartCalendar && renderCalendarDropdown("startDate", formData.startDate)}
              </div>

              {/* End Date Component Wrapper */}
              <div ref={endCalendarRef} className="flex-1 space-y-1 relative">
                <span className="text-[11px] font-semibold text-gray-400 block">End Date</span>
                <button
                  type="button"
                  onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm text-left transition-all hover:bg-white ${
                    errors.endDate ? "border-red-400" : "border-gray-200 focus:border-[#2F6F4E]"
                  } ${formData.endDate ? "text-gray-800" : "text-gray-400"}`}
                >
                  <span>{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : "Select date"}</span>
                  <Calendar size={14} className="text-gray-400" />
                </button>
                {showEndCalendar && renderCalendarDropdown("endDate", formData.endDate)}
              </div>

            </div>
            
            {(errors.startDate || errors.endDate) && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {errors.startDate || errors.endDate}
              </p>
            )}
          </div>

          {/* Input: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <AlignLeft size={13} className="text-gray-400" /> Description <span className="text-gray-400 normal-case font-normal ml-0.5">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="What's the vibe of this trip? Mention itinerary milestones..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:border-[#2F6F4E] focus:ring-2 focus:ring-[#2F6F4E]/20 resize-none outline-none"
            />
          </div>

          {/* Submission CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2F6F4E] text-white font-semibold rounded-xl text-sm transition-all hover:bg-[#23543b] active:scale-[0.99] disabled:opacity-70 shadow-md shadow-[#2F6F4E]/10"
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