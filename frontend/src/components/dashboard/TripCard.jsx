import React from "react";
import { theme } from "../../common/common";
import { useNavigate } from "react-router-dom";

// Clean vector icons matching our application ecosystem ✨
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
      className={`
        ${theme.cards.tripCard}
        ${theme.animations.tripHover}
        bg-white border border-gray-100 p-6 rounded-2xl shadow-xs
        hover:shadow-md hover:border-gray-200/60
        flex flex-col justify-between cursor-pointer
        transition-all duration-200 font-sans antialiased group
      `}
    >
      <div>
        {/* Card Header Title */}
        <h3 className="text-lg font-bold text-gray-800 tracking-tight leading-snug mb-4 group-hover:text-[#2F6F4E] transition-colors">
          {trip?.title || "Untitled Adventure"}
        </h3>

        {/* Dynamic Meta Indicators */}
        <div className="space-y-3 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2.5">
            <MapPin size={15} className="text-[#2F6F4E]/80" />
            <span className="text-gray-700 truncate">{trip?.destination || "Flexible Destination"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar size={15} className="text-gray-400" />
            <span className="text-gray-600">
              {startDate && endDate ? `${startDate} — ${endDate}` : "Dates Pending"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Users size={15} className="text-gray-400" />
            <span className="bg-gray-50 px-2 py-0.5 rounded-md text-gray-600 font-semibold border border-gray-100">
              {trip?.members?.length || 0} Members
            </span>
          </div>
        </div>
      </div>

      {/* Footer Interactive Trigger Action */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-bold text-[#2F6F4E] flex items-center gap-1.5 group-hover:underline underline-offset-4">
          Open Journey
          <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};

export default TripCard;