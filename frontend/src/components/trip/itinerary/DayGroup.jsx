import React from "react";
import ActivityCard from "./ActivityCard";
import { CalendarDays } from "lucide-react";

const DayGroup = ({
  day,
  activities = [],
  onActivityClick,
  isAdmin
}) => {
  
  if (!activities || activities.length === 0) return null;

  return (
    <div className="w-full font-sans antialiased text-slate-900 mb-10 last:mb-4 relative">
      
      {/* 1. Header Node Container Section */}
      <div className="flex items-center gap-3 mb-5 select-none">
        {/* Decorative Circular Node Anchor matching screenshot timeline */}
        <div className="w-3 h-3 rounded-full bg-[#2D6A4F] ring-4 ring-[#E9F5ED] flex-shrink-0 z-10" />
        
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-stone-400 mt-0.5" />
          <h2 className="text-sm font-bold tracking-tight text-slate-800">
            {day}
          </h2>
          <span className="text-[10px] font-bold bg-[#FAF8F5] text-stone-400 px-2 py-0.5 rounded-md border border-[#EFE9DC]">
            {activities.length} {activities.length === 1 ? "event" : "events"}
          </span>
        </div>
      </div>

      {/* 2. Connected Vertical Timeline Track */}
      <div 
        className="
          ml-[5px] pl-6 
          border-l border-dashed border-[#EFE9DC]
          space-y-4 relative
        "
      >
        {activities.map((activity) => (
          <div 
            key={activity._id} 
            className="animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <ActivityCard
              id={`event-${activity._id}`}
              activity={activity}
              onClick={onActivityClick}
              isAdmin={isAdmin}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default DayGroup;