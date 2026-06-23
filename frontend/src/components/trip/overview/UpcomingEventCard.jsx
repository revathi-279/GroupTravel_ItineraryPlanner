import { useEffect, useState } from "react";
import { theme } from "../../../common/common";
import { itineraryService } from "../../../services/itineraryService";
import { Calendar, Clock, MapPin } from "lucide-react";

const UpcomingEventCard = ({ trip, onViewEvent }) => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await itineraryService.getItineraries(trip._id);
        const itineraries = response.allItineraries || [];

        const upcoming = itineraries
          .filter((item) => item.status === "Upcoming")
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))[0];

        setEvent(upcoming || null);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [trip]);

  return (
    <div className="bg-white border border-[#EFE9DC] rounded-3xl p-6 font-sans antialiased text-slate-900">
      <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-5 select-none">
        Next On Your Journey
      </h3>

      {!event ? (
        /* Empty State Placeholder View */
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={22} className="text-stone-400" />
          </div>
          <p className="text-xs font-semibold text-stone-400 max-w-[220px] mx-auto leading-relaxed">
            Add itinerary events to keep your Journey organized
          </p>
        </div>
      ) : (
        /* Active Upcoming Event Meta Tracker View */
        <>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">
            {event.title}
          </h2>

          <div className="mt-5 space-y-3 text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-2.5">
              <Calendar size={14} className="text-stone-400 flex-shrink-0" />
              <span className="text-slate-700">
                {new Date(event.dateTime).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock size={14} className="text-stone-400 flex-shrink-0" />
              <span className="text-slate-700">
                {new Date(event.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-[#2D6A4F] flex-shrink-0" />
              <span className="text-slate-700 truncate">{event.location}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onViewEvent?.(event)}
                className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] flex items-center gap-1 transition-colors"
              >
                View Details →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingEventCard;