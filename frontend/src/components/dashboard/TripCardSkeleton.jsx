import { theme } from "../../common/common";

const TripCardSkeleton = () => {

  return (

    <div
      className={
        theme.skeleton.trip
      }
    >

      <div
        className="
        h-6
        w-3/4
        bg-gray-200
        rounded-full
        mb-5
        "
      />

      <div
        className="
        h-4
        w-1/2
        bg-gray-200
        rounded-full
        mb-3
        "
      />

      <div
        className="
        h-4
        w-2/3
        bg-gray-200
        rounded-full
        mb-3
        "
      />

      <div
        className="
        h-4
        w-1/3
        bg-gray-200
        rounded-full
        "
      />

      <div
        className="
        h-5
        w-24
        bg-gray-200
        rounded-full
        mt-6
        "
      />

    </div>

  );
};

export default TripCardSkeleton;