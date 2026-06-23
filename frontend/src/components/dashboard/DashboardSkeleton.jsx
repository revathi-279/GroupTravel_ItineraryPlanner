import { theme } from "../../common/common";
import TripCardSkeleton from "./TripCardSkeleton";

const DashboardSkeleton = () => {

  return (
    <>
      {/* Attention Skeleton */}
      <div className="w-full relative overflow-hidden rounded-3xl p-8 bg-white border border-[#EFE9DC] min-h-[220px] animate-pulse">
        <div className="h-4 w-32 bg-stone-200/60 rounded-full mb-4" />
        <div className="h-10 w-72 bg-stone-200/60 rounded-full mb-6" />
        <div className="h-4 w-full bg-stone-200/60 rounded-full" />
      </div>

      {/* Search Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
        <div className="w-full sm:max-w-md h-11 bg-stone-200/60 rounded-xl animate-pulse" />
        <div className="w-full sm:w-40 h-11 bg-stone-200/60 rounded-xl animate-pulse" />
      </div>

      {/* Section Title */}
      <div className="h-6 w-36 bg-stone-200/60 rounded-full animate-pulse" />

      {/* Trip Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />
      </div>
    </>
  );
};

export default DashboardSkeleton;