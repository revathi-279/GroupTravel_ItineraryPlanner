import React from "react";
import { theme } from "../../../common/common";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Clock, MapPin, User } from "lucide-react";

const ActivityCard = ({ activity, onClick }) => {
  const time = activity?.dateTime
    ? new Date(activity.dateTime).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Flexible";

  return (
    <div
      onClick={() => onClick?.(activity)}
      className="
        bg-white border border-gray-200/60 p-5 rounded-2xl shadow-xs 
        hover:shadow-md hover:border-gray-300 cursor-pointer 
        transition-all duration-200 font-sans antialiased flex flex-col justify-between group
      "
    >
      <div>
        {/* Top Header Row: Formatted Timestamp */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E4631]/80 mb-2.5">
          <Clock size={13} className="text-[#1E4631]/60" />
          <span>{time}</span>
        </div>

        {/* Central Core Text Content */}
        <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug group-hover:text-[#1E4631] transition-colors">
          {activity?.title || "Untitled Activity"}
        </h3>

        {/* Context Location String Capsule */}
        {activity?.location && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mt-2">
            <MapPin size={13} className="text-gray-300 flex-shrink-0" />
            <span className="truncate max-w-[280px] text-gray-500">{activity.location}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer Section: Creator Information & Status Badge */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
        
        {/* Profile Card Fragment Row */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden flex-shrink-0">
            {activity?.createdBy?.profilePicture ? (
              <img
                src={activity.createdBy.profilePicture}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[9px] font-bold uppercase text-gray-400">
                {activity?.createdBy?.name?.[0] || <User size={10} />}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-400 truncate max-w-[120px]">
            {activity?.createdBy?.name || "Traveler"}
          </span>
        </div>

        {/* Premium Context Action/Status Pill Label Tag */}
        {activity?.status && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E4631]/5 text-[#1E4631] px-2.5 py-1 rounded-md flex-shrink-0">
            {activity.status}
          </span>
        )}

      </div>
    </div>
  );
};

export default ActivityCard;