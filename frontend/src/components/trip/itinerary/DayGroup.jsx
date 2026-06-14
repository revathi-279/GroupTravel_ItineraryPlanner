import React from "react";
import ActivityCard from "./ActivityCard";

// Clean premium layout indicators matching our typography ecosystem ✨
import { CalendarDays } from "lucide-react";

const DayGroup = ({ day, activities = [], onActivityClick }) => {
  
  // Guard clause to handle unexpected rendering edge-cases cleanly
  if (!activities || activities.length === 0) return null;

  return (
    <div className="w-full font-sans antialiased text-gray-900 mb-12 last:mb-4 relative">
      
      {/* 1. Header Node Container Section */}
      <div className="flex items-center gap-3 mb-6 select-none">
        {/* Decorative Circular Node Anchor point */}
        <div className="w-3 h-3 rounded-full bg-[#1E4631] ring-4 ring-[#1E4631]/10 flex-shrink-0 z-10" />
        
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-gray-400 mt-0.5" />
          <h2 className="text-base font-extrabold tracking-tight text-gray-900">
            {day}
          </h2>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md border border-gray-200/30">
            {activities.length} {activities.length === 1 ? "event" : "events"}
          </span>
        </div>
      </div>

      {/* 2. Connected Dynamic Vertical Timeline Track Track */}
      <div 
        className="
          ml-[5px] pl-6 
          border-l border-dashed border-gray-200/80
          space-y-5 relative
        "
      >
        {activities.map((activity) => (
          <div 
            key={activity._id} 
            className="animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <ActivityCard
              activity={activity}
              onClick={onActivityClick}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default DayGroup;