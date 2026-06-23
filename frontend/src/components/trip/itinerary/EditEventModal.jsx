import { useState, useEffect } from "react";
import { theme } from "../../../common/common";
import { itineraryService } from "../../../services/itineraryService";
import Spinner from "../../common/Spinner";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Edit3, MapPin, Calendar, Clock, AlignLeft, X, AlertCircle, ChevronDown } from "lucide-react";

const EditEventModal = ({ open, onClose, itinerary, trip, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [dateFields, setDateFields] = useState({
    date: "", // Will store parsed "YYYY-MM-DD"
    time: ""  // Will store parsed "HH:MM"
  });

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
  });

  // Custom Dropdown UI Open/Close States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Helper utility to safely parse and separate ISO date strings into internal field blocks
  const extractDateAndValues = (isoString) => {
    if (!isoString) return { date: "", time: "" };
    const d = new Date(isoString);
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  // Synchronize form states dynamically whenever the editing itinerary payload changes
  useEffect(() => {
    if (!itinerary) return;

    const parsedDateTimeFields = extractDateAndValues(itinerary.dateTime);

    setFormData({
      title: itinerary.title || "",
      location: itinerary.location || "",
      description: itinerary.description || "",
    });

    setDateFields(parsedDateTimeFields);
    setErrors({});
  }, [itinerary]);

  // Close custom pickers dynamically on clicking anywhere outside their respective wrapper fields
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".date-picker-wrapper")) {
        setShowDatePicker(false);
      }
      if (!e.target.closest(".time-picker-wrapper")) {
        setShowTimePicker(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Handle Escape key closure shortcut safely
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
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = (combinedDateTimeString) => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event name is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Event name must be at least 3 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!dateFields.date || !dateFields.time) {
      newErrors.dateTime = "Both Date and Time fields are required";
      return newErrors;
    }

    const eventDate = new Date(combinedDateTimeString);
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    
    tripStart.setHours(0, 0, 0, 0);
    tripEnd.setHours(23, 59, 59, 999);

    if (eventDate < tripStart || eventDate > tripEnd) {
      newErrors.dateTime = "Event must be within trip dates";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let combinedDateTime = "";
    if (dateFields.date && dateFields.time) {
      combinedDateTime = `${dateFields.date}T${dateFields.time}`;
    }

    const validationErrors = validate(combinedDateTime);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await itineraryService.updateItinerary({
        itineraryId: itinerary._id,
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        dateTime: combinedDateTime,
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
    setShowDatePicker(false);
    setShowTimePicker(false);
    onClose();
  };

  // Generate date array elements dynamically between trip windows
  const generateTripDates = () => {
    if (!trip?.startDate || !trip?.endDate) return [];
    const dates = [];
    let current = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Generate clean 30-minute intervals for our scrollable custom dropdown timeline list
  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hStr = hour.toString().padStart(2, "0");
        const mStr = min.toString().padStart(2, "0");
        
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayStr = `${displayHour}:${mStr} ${period}`;

        intervals.push({ value: `${hStr}:${mStr}`, display: displayStr });
      }
    }
    return intervals;
  };

  const tripDates = generateTripDates();
  const timeIntervals = generateTimeIntervals();

  const selectedDateDisplay = dateFields.date 
    ? new Date(dateFields.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Select Day";

  const selectedTimeDisplay = dateFields.time
    ? timeIntervals.find(t => t.value === dateFields.time)?.display || dateFields.time
    : "Select Time";

  const tripStartFormatted = trip?.startDate ? new Date(trip.startDate).toLocaleDateString() : "";
  const tripEndFormatted = trip?.endDate ? new Date(trip.endDate).toLocaleDateString() : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Overlay Backdrop layer ensuring layout color temperature stability */}
      <div onClick={handleCloseWrapper} className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity" />

      {/* Main Structural Modal Content Box - Pure White Base Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] p-6 md:p-8 z-10 font-sans antialiased animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        
        {/* Absolute Dismissal Trigger */}
        <button
          type="button"
          onClick={handleCloseWrapper}
          className="p-2 rounded-full absolute right-6 top-6 text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Branding Header */}
        <div className="mb-6 pr-8 select-none">
          <div className="flex items-center gap-2 text-[#2D6A4F] mb-1">
            <Edit3 size={18} />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Edit Journey Event
            </h2>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Modify coordination items, update lodgings, or adjust schedules seamlessly on your shared timeline.
          </p>
        </div>

        {/* Form Grid Area Structure */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Form input item block: Event Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Event Details
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Rest in Hotel or Group Dinner"
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

          {/* Form input item block: Location String */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <MapPin size={13} className="text-stone-400" /> Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Vrindavan"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all ${
                errors.location ? "border-rose-300 focus:border-rose-400" : "border-[#EFE9DC]"
              }`}
            />
            {errors.location && (
              <p className="text-rose-600 text-[11px] font-semibold flex items-center gap-1">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>

          {/* Split Custom Dropdown Section Inputs */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Custom Interactive Date Wrapper Block Container */}
            <div className="space-y-1.5 relative date-picker-wrapper">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-stone-400" /> Event Date
              </label>
              
              <button
                type="button"
                onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-between transition-all hover:bg-stone-50 ${
                  errors.dateTime ? "border-rose-300" : "border-[#EFE9DC]"
                }`}
                style={{ minHeight: "42px" }}
              >
                <span>{selectedDateDisplay}</span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              {/* Day Selection Popover Panel Overlay */}
              {showDatePicker && (
                <div className="absolute left-0 mt-1.5 w-full bg-white border border-[#EFE9DC] rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                  {tripDates.map((dateObj, idx) => {
                    const year = dateObj.getFullYear();
                    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
                    const day = dateObj.getDate().toString().padStart(2, "0");
                    const fullValueString = `${year}-${month}-${day}`;

                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setDateFields({ ...dateFields, date: fullValueString });
                          setShowDatePicker(false);
                          if (errors.dateTime) setErrors({ ...errors, dateTime: "" });
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-[#FAF8F5] hover:text-[#2D6A4F] transition-colors"
                      >
                        {dateObj.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Interactive Time Wrapper Block Container */}
            <div className="space-y-1.5 relative time-picker-wrapper">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Clock size={13} className="text-stone-400" /> Start Time
              </label>

              <button
                type="button"
                onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                className={`w-full px-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-between transition-all hover:bg-stone-50 ${
                  errors.dateTime ? "border-rose-300" : "border-[#EFE9DC]"
                }`}
                style={{ minHeight: "42px" }}
              >
                <span>{selectedTimeDisplay}</span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              {/* Time Interval Selector Scrollbar Menu Grid Overlay */}
              {showTimePicker && (
                <div className="absolute right-0 mt-1.5 w-full bg-white border border-[#EFE9DC] rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                  {timeIntervals.map((tObj, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setDateFields({ ...dateFields, time: tObj.value });
                        setShowTimePicker(false);
                        if (errors.dateTime) setErrors({ ...errors, dateTime: "" });
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-[#FAF8F5] hover:text-[#2D6A4F] transition-colors"
                    >
                      {tObj.display}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Bounds Verification Warning Alert Banner Box */}
          <div className="space-y-1.5">
            <div className="bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl p-3 text-[11px] font-semibold text-stone-400 select-none">
              Trip Window Boundaries: <span className="text-slate-700 font-bold">{tripStartFormatted} — {tripEndFormatted}</span>
            </div>
            {errors.dateTime && (
              <p className="text-rose-600 text-[11px] font-semibold flex items-center gap-1">
                <AlertCircle size={12} /> {errors.dateTime}
              </p>
            )}
          </div>

          {/* Form textarea field item block: Optional Notes/Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <AlignLeft size={13} className="text-stone-400" /> Description <span className="text-stone-400 normal-case font-medium ml-0.5">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="Add reference notes, meeting guidelines, links, or ticket details..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm outline-none text-slate-800 placeholder-stone-400 resize-none font-medium transition-all focus:bg-white focus:border-[#2D6A4F]"
            />
          </div>

          {/* Interactive Trigger Control Action Toolbars Footer Row */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F5F0E6] mt-6 select-none">
            <button
              type="button"
              onClick={handleCloseWrapper}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Saving Updates...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEventModal;