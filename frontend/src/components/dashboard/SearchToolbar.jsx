import { Search, Plus } from "lucide-react";

const SearchToolbar = ({
  search,
  setSearch,
  onCreateTrip,
}) => {

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
      
      {/* Search Input Container */}
      <div className="relative w-full sm:max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search trips or destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EFE9DC] rounded-xl text-sm transition-all duration-200 outline-none placeholder-stone-400 focus:border-[#2D6A4F] text-slate-800 shadow-xs"
        />
      </div>

      {/* Create Button Container */}
      <button
        onClick={onCreateTrip}
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-xs transition-all active:scale-[0.98] whitespace-nowrap"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>Create Journey</span>
      </button>

    </div>
  );
};

export default SearchToolbar;