import React from "react";
import { theme } from "../../common/common";

const tabs = [
  "Overview",
  "Itinerary",
  "Expenses",
  "Gallery",
  "Polls",
];

const TripTabs = ({
  activeTab,
  setActiveTab,
}) => {

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-2xl select-none w-max font-sans antialiased">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "text-stone-400 hover:text-slate-800 hover:bg-white/60"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default TripTabs;