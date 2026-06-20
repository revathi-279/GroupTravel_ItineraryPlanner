import React from "react";
import { theme } from "../../../common/common";

// Premium minimalistic vectors matching our corporate design identity ✨
import {
  Clock,
  MapPin,
  User,
  Check,
  X,
} from "lucide-react";

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

    const isCompleted =
  activity?.status ===
  "Completed";

const isCancelled =
  activity?.status ===
  "Cancelled";



const now = new Date();

const eventDate =
  new Date(activity.dateTime);


const isToday =
  eventDate.toDateString() ===
  now.toDateString();

  
  const needsReview =
  activity?.needsReview;
const isOngoing =
  activity.status === "Upcoming" &&
  eventDate <= now;

const isUpcoming =

  activity?.status ===
    "Upcoming"

  &&

  !isOngoing

  &&

  !needsReview;



  console.log(
  activity.title,
  activity.status,
  activity.dateTime,
  isAdmin
);
  return (
  <div
    id={id}
    onClick={() => onClick?.(activity)}
      className="
        bg-white border border-gray-200/60 p-5 rounded-2xl shadow-xs 
        hover:shadow-md hover:border-gray-300 cursor-pointer 
        transition-all duration-200 font-sans antialiased flex flex-col justify-between group
      "
    >
      <div>
        { isAdmin && needsReview && (

  <div
    className="
    mb-4
    p-3
    rounded-xl
    bg-amber-50
    border
    border-amber-200
    "
  >

    <p
      className="
      text-xs
      font-semibold
      text-amber-700
      "
    >
      Status Review Needed
    </p>

    <p
      className="
      text-[11px]
      text-amber-600
      mt-1
      "
    >
      This event time has passed and is still marked as Upcoming.
    </p>

  </div>

)}
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
        <div
  className="
  flex
  items-center
  gap-2
  "
>

  {isCompleted && (

    <>
      <div
        className="
        w-5
        h-5
        rounded-full
        bg-green-600
        flex
        items-center
        justify-center
        "
      >
        <Check
          size={12}
          className="text-white"
        />
      </div>

      <span
        className="
        text-[10px]
        font-bold
        uppercase
        text-green-700
        "
      >
        Completed
      </span>
    </>

  )}

  {isOngoing && (

    <>
      <div
  className="
  w-5
  h-5
        rounded-full
        bg-[#2F6F4E]
        animate-pulse
        "
      />

      <span
        className="
        text-[10px]
        font-bold
        uppercase
        text-[#2F6F4E]
        "
      >
        Ongoing
      </span>
    </>

  )}

  {isUpcoming && (

    <>
     <div
  className="
  w-5
  h-5
  rounded-full
  border-2
  border-gray-400
  bg-white
  "
/>

      <span
        className="
        text-[10px]
        font-bold
        uppercase
        text-gray-500
        "
      >
        Upcoming
      </span>
    </>

  )}

  {isCancelled && (

    <>
      <div
        className="
        w-5
        h-5
        rounded-full
        bg-red-500
        flex
        items-center
        justify-center
        "
      >
        <X
          size={12}
          className="text-white"
        />
      </div>

      <span
        className="
        text-[10px]
        font-bold
        uppercase
        text-red-600
        "
      >
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