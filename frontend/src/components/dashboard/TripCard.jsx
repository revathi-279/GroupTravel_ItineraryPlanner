import React from "react";
import { theme } from "../../common/common";
import { useNavigate } from "react-router-dom";

import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const startDate = trip?.startDate 
    ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
    : "";
    
  const endDate = trip?.endDate 
    ? new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
    : "";

  const handleCardClick = () => {
    navigate(`/trip/${trip._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-[#EFE9DC] p-6 rounded-3xl shadow-xs hover:shadow-md hover:border-[#2D6A4F]/40 flex flex-col justify-between cursor-pointer transition-all duration-200 font-sans antialiased group"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug mb-4 group-hover:text-[#2D6A4F] transition-colors">
          {trip?.title || "Untitled Adventure"}
        </h3>

        <div className="space-y-3 text-sm font-medium text-stone-500">
          <div className="flex items-center gap-2.5">
            <MapPin size={15} className="text-[#2D6A4F]" />
            <span className="text-slate-700 truncate">{trip?.destination || "Flexible Destination"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar size={15} className="text-stone-400" />
            <span className="text-slate-600">
              {startDate && endDate ? `${startDate} — ${endDate}` : "Dates Pending"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Users size={15} className="text-stone-400" />
            <span className="bg-[#FAF8F5] text-[#2D6A4F] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#EFE9DC]">
              {trip?.members?.length || 0} Members
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#F5F0E6] flex items-center justify-between">
        <span className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1.5">
          Open Journey
          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};

export default TripCard;