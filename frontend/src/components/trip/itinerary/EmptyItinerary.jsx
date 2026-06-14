import { theme }
from "../../../common/common";

const EmptyItinerary = ({
  onCreate,
  isAdmin,
}) => {

  return (

    <div
      className="
      bg-white
      rounded-3xl
      p-12
      text-center
      shadow-sm
      "
    >

      <div className="text-6xl">
        🗺️
      </div>

      <h2
        className="
        mt-4
        text-2xl
        font-bold
        "
      >
        No plans added yet
      </h2>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        Start building your
        travel timeline.
      </p>

     {isAdmin && (
      <button
        onClick={onCreate}
        className={`
        ${theme.buttons.primary}
        mt-6
        px-6
        py-3
        rounded-2xl
        `}
      >
        Add First Event
      </button>

        )}

    </div>

  ) ;
};

export default EmptyItinerary;