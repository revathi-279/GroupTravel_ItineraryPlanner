import React from "react";
import { theme } from "../../../common/common";
import { Clock, MapPin, User, Check, X, AlertTriangle } from "lucide-react";

const ActivityCard = ({
  id,
  activity,
  onClick,
  isAdmin
}) => {
  const time = activity?.dateTime
    ? new Date(activity.dateTime).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Flexible";

  const isCompleted = activity?.status === "Completed";
  const isCancelled = activity?.status === "Cancelled";

  const now = new Date();
  const eventDate = new Date(activity.dateTime);

  const needsReview = activity?.needsReview;
  const isOngoing = activity.status === "Upcoming" && eventDate <= now;
  const isUpcoming = activity?.status === "Upcoming" && !isOngoing && !needsReview;

  return (
    <div
      id={id}
      onClick={() => onClick?.(activity)}
      className="bg-white border border-[#EFE9DC] p-5 rounded-3xl shadow-2xs hover:shadow-sm hover:border-[#2D6A4F]/40 cursor-pointer transition-all duration-200 font-sans antialiased flex flex-col justify-between group"
    >
      <div>
        {/* Admin Action Notice Banner */}
        {isAdmin && needsReview && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
            <div>
              <p className="leading-none mb-1">Status Review Needed</p>
              <p className="text-[11px] text-amber-600/90 font-medium leading-tight">
                This event time has passed and is still marked as Upcoming.
              </p>
            </div>
          </div>
        )}

        {/* Card Header Row: Formatted Timestamp */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] mb-2 select-none">
          <Clock size={13} />
          <span>{time}</span>
        </div>

        {/* Central Core Title Text */}
        <h3 className="text-sm font-bold text-slate-800 tracking-tight leading-snug group-hover:text-[#2D6A4F] transition-colors">
          {activity?.title || "Untitled Activity"}
        </h3>

        {/* Context Location String Capsule */}
        {activity?.location && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400 mt-2 select-none">
            <MapPin size={13} className="text-stone-300 flex-shrink-0" />
            <span className="truncate max-w-[280px] text-stone-500">{activity.location}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer Section: Creator Meta Info & Status Badge */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F5F0E6] select-none">
        
        {/* User Identity Row */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 overflow-hidden flex-shrink-0">
            {activity?.createdBy?.profilePicture ? (
              <img
                src={activity.createdBy.profilePicture}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[9px] font-bold uppercase text-stone-400">
                {activity?.createdBy?.name?.[0] || <User size={10} />}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-stone-400 truncate max-w-[120px]">
            {activity?.createdBy?.name || "Traveler"}
          </span>
        </div>

        {/* Status Pill Label Tag Group */}
        <div className="flex items-center gap-1.5">
          {isCompleted && (
            <>
              <div className="w-4 h-4 rounded-full bg-[#E9F5ED] text-[#2D6A4F] flex items-center justify-center">
                <Check size={10} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                Completed
              </span>
            </>
          )}

          {isOngoing && (
            <>
              <div className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                Ongoing
              </span>
            </>
          )}

          {isUpcoming && (
            <>
              <div className="w-2 h-2 rounded-full bg-stone-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Upcoming
              </span>
            </>
          )}

          {isCancelled && (
            <>
              <div className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <X size={10} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Cancelled
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ActivityCard;