import {
  X
}
from "lucide-react";

const ActivityDrawer = ({
  open,
  onClose,
  updates,
  currentUser
}) => {

  if (!open)
    return null;

  const getTimeAgo =
  (date) => {

    const seconds =
      Math.floor(
        (
          new Date() -
          new Date(date)
        ) / 1000
      );

    const minutes =
      Math.floor(
        seconds / 60
      );

    const hours =
      Math.floor(
        minutes / 60
      );

    const days =
      Math.floor(
        hours / 24
      );

    if (minutes < 1)
      return "Just now";

    if (minutes < 60)
      return `${minutes} min ago`;

    if (hours < 24)
      return `${hours} hr ago`;

    return `${days} day ago`;

  };

  const getMessage =
  (update) => {


    const isCurrentUser =
      update.user?._id?.toString() ===
      currentUser?._id?.toString();

    const actor =
      isCurrentUser
        ? "You"
        : update.user?.name;

    switch (
      update.type
    ) {

      case "gallery_uploaded":
        return `${actor} uploaded a photo`;

      case "expense_added":
case "expense_settled":
case "itinerary_status_updated":
  return update.message.replace(
    update.user?.name,
    actor
  );

      case "poll_created":
        return `${actor} created a poll`;

      case "member_joined":
        return `${actor} joined the trip`;

      case "member_left":
        return `${actor} left the trip`;

      case "itinerary_added":
        return `${actor} added an itinerary event`;

      case "itinerary_updated":
        return `${actor} updated an itinerary event`;

        case "itinerary_status_updated":
  return update.message.replace(
    update.user?.name,
    actor
  );

      case "itinerary_deleted":
        return `${actor} deleted an itinerary event`;

      default:
        return update.message;
    }

  };

  return (

    <>
      <div
        className="
        fixed
        inset-0
        bg-black/40
        z-40
        "
        onClick={onClose}
      />

      <div
        className="
        fixed
        right-0
        top-0
        h-screen
        w-[420px]
        bg-white
        shadow-2xl
        z-50
        flex
        flex-col
        "
      >

        <div
          className="
          flex
          items-center
          justify-between
          p-6
          border-b
          "
        >

          <h2
            className="
            text-lg
            font-bold
            "
          >
            Activity Timeline
          </h2>

          <button
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        <div
          className="
          flex-1
          overflow-y-auto
          p-6
          space-y-5
          "
        >

          {updates.map(
            update => (

              <div
                key={update._id}
                className="
                flex
                gap-3
                "
              >

                {update.user?.profilePicture ? (

                  <img
                    src={
                      update.user.profilePicture
                    }
                    alt=""
                    className="
                    w-10
                    h-10
                    rounded-full
                    object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#EAF3ED]
                    flex
                    items-center
                    justify-center
                    font-semibold
                    "
                  >
                    {
                      update.user?.name?.[0]
                    }
                  </div>

                )}

                <div>

                  <p
                    className="
                    text-sm
                    text-gray-800
                    "
                  >
                    {
                      getMessage(
                        update
                      )
                    }
                  </p>

                  <p
                    className="
                    text-xs
                    text-gray-400
                    mt-1
                    "
                  >
                    {
                      getTimeAgo(
                        update.createdAt
                      )
                    }
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>
    </>

  );

};

export default ActivityDrawer;