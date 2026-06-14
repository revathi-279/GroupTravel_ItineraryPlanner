import { useState, useEffect } from "react";
import { theme } from "../../../common/common";
import { itineraryService } from "../../../services/itineraryService";
import Spinner from "../../common/Spinner";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Compass, MapPin, Calendar, AlignLeft, X, AlertCircle } from "lucide-react";

const CreateEventModal = ({ open, onClose, trip, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    dateTime: "",
  });

  // Handle Escape key closure shortcut safely
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
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event name is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Event name must be at least 3 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.dateTime) {
      newErrors.dateTime = "Date & Time is required";
    }

    const eventDate = new Date(formData.dateTime);
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);

    if (formData.dateTime && (eventDate < tripStart || eventDate > tripEnd)) {
      newErrors.dateTime = "Event must be within trip dates";
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
      await itineraryService.createItinerary({
        tripId: trip._id,
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        dateTime: formData.dateTime,
        isTimeSpecified: true,
      });

      onCreated();
      onClose();
      setFormData({
        title: "",
        location: "",
        description: "",
        dateTime: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const tripStartFormatted = trip?.startDate ? new Date(trip.startDate).toLocaleDateString() : "";
  const tripEndFormatted = trip?.endDate ? new Date(trip.endDate).toLocaleDateString() : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Overlay Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Main Structural Modal Content Box Layout */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 z-10 font-sans antialiased animate-in fade-in zoom-in-95 duration-150">
        
        {/* Absolute Close Action Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header Section */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 text-[#1E4631] mb-1">
            <Compass size={18} />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Add Journey Event
            </h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pin an important stop, meal coordination, or itinerary milestone onto your shared crew timeline.
          </p>
        </div>

        {/* Modal Main Core Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input block: Event Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              Event Details
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Temple Tour or Group Dinner"
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

          {/* Input block: Location */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin size={13} className="text-gray-400" /> Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Vrindavan ISKCON Temple"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-800 placeholder-gray-400 ${
                errors.location ? "border-red-300 focus:border-red-400" : "border-gray-200"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>

          {/* Input block: Schedule Timestamp */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" /> Date & Time
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-700 ${
                errors.dateTime ? "border-red-300 focus:border-red-400" : "border-gray-200"
              }`}
            />
            
            {/* Dynamic visual range timeline reminder container tag */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-[11px] font-medium text-gray-400">
              Trip Window Boundaries: <span className="text-gray-600 font-semibold">{tripStartFormatted} — {tripEndFormatted}</span>
            </div>

            {errors.dateTime && (
              <p className="text-red-500 text-[11px] font-medium flex items-center gap-1">
                <AlertCircle size={12} /> {errors.dateTime}
              </p>
            )}
          </div>

          {/* Input block: Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <AlignLeft size={13} className="text-gray-400" /> Description <span className="text-gray-400 normal-case font-normal ml-0.5">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="Provide notes, attire expectations, or dynamic transportation plans..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-800 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Footer Interactive Actions Toolbars */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center gap-1.5">
                  <Spinner />
                  <span>Pinning Event...</span>
                </div>
              ) : (
                "Create Event"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;