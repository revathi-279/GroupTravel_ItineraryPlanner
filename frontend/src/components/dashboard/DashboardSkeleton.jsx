import { theme } from "../../common/common";
import TripCardSkeleton from "./TripCardSkeleton";

const DashboardSkeleton = () => {

  return (

    <>

      {/* Attention Skeleton */}

      <div
        className={
          theme.skeleton.attention
        }
      >

        <div
          className="
          h-4
          w-32
          bg-gray-200
          rounded-full
          mb-4
          "
        />

        <div
          className="
          h-10
          w-72
          bg-gray-200
          rounded-full
          mb-6
          "
        />

        <div
          className="
          h-4
          w-full
          bg-gray-200
          rounded-full
          "
        />

      </div>

      {/* Search Skeleton */}

      <div
        className="
        flex
        gap-4
        "
      >

        <div
          className="
          flex-1
          h-12
          bg-gray-200
          rounded-2xl
          animate-pulse
          "
        />

        <div
          className="
          w-40
          h-12
          bg-gray-200
          rounded-2xl
          animate-pulse
          "
        />

      </div>

      {/* Section Title */}

      <div
        className="
        h-8
        w-48
        bg-gray-200
        rounded-full
        animate-pulse
        "
      />

      {/* Trip Skeleton Grid */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-5
        "
      >

        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />

      </div>

    </>

  );
};

export default DashboardSkeleton;