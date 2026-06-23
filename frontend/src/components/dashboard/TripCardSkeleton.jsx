import { theme } from "../../common/common";

const TripCardSkeleton = () => {

  return (
    <div className="bg-white border border-[#EFE9DC] p-6 rounded-3xl shadow-xs flex flex-col justify-between min-h-[220px] animate-pulse">
      <div>
        {/* Title Bar Placeholder */}
        <div className="h-6 w-3/4 bg-stone-200/60 rounded-full mb-5" />

        {/* Info Rows Placeholders */}
        <div className="space-y-3">
          <div className="h-4 w-1/2 bg-stone-200/60 rounded-full" />
          <div className="h-4 w-2/3 bg-stone-200/60 rounded-full" />
          <div className="h-4 w-1/3 bg-stone-200/60 rounded-full" />
        </div>
      </div>

      {/* Footer Open Journey Link Placeholder */}
      <div className="mt-6 pt-4 border-t border-[#F5F0E6]">
        <div className="h-4 w-24 bg-stone-200/60 rounded-full" />
      </div>
    </div>
  );
};

export default TripCardSkeleton;