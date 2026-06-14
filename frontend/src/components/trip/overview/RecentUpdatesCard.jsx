import {
  useEffect,
  useState
}
from "react";

import {
  activityService
}
from "../../../services/activityService";

import { Sparkles } from "lucide-react";

const RecentUpdatesCard = ({
  trip,
  currentUser
}) => {
  const [
  updates,
  setUpdates
] = useState([]);

useEffect(() => {

  const load =
  async () => {

    const response =
      await activityService
        .getActivities(
          trip._id
        );

    setUpdates(
      response.activities
    );
  };

  load();

}, [trip]);  

const getMessage = (
  update
) => {

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
  return `${actor} added an expense`;

   case "expense_settled":
  return `${actor} settled an expense`;
case "poll_created":
  return `${actor} created a poll`;

    case "member_joined":
      return `${actor} joined the trip`;

    case "itinerary_added":
  return `${actor} added an itinerary event`;

   case "itinerary_updated":
  return `${actor} updated an itinerary event`;

    
case "itinerary_deleted":
  return `${actor} deleted an itinerary event`;

  case "member_left":
  return `${actor} left the trip`;

    default:
      return update.message;
  }

};

const getTimeAgo = (
  date
) => {

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

  if (hours === 1) {
  return "1 hr ago";
}

if (minutes === 1) {
  return "1 min ago";
}

 if (days === 1) {
  return "1 day ago";
}

return `${days} days ago`;
};



  return (
    <div className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-xs h-full flex flex-col font-sans antialiased text-gray-900">
      
      {/* Card Header Section Title */}
      <div className="flex items-center gap-2 mb-5 select-none">
        <Sparkles size={16} className="text-[#1E4631]/80" />
        <h2 className="text-sm font-bold tracking-wider uppercase text-gray-400">
          Recent Updates
        </h2>
      </div>

      {updates.length > 0 && (

<div
  className="
  space-y-4
  overflow-y-auto
  max-h-[500px]
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
    src={update.user.profilePicture}
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
    {update.user?.name?.[0]}
  </div>

)}

        <div>

         <p
  className="
  text-sm
  text-gray-800
  "
>
  {getMessage(update)}
</p>

          <p
            className="
            text-xs
            text-gray-400
            mt-1
            "
          >
            {getTimeAgo(
  update.createdAt
)}
          </p>

        </div>

      </div>

    )
  )}

</div>

)}

{updates.length === 0 && (

  <div
    className="
    flex-1
    flex
    flex-col
    items-center
    justify-center
    text-center
    "
  >

    <div
      className="
      w-14
      h-14
      rounded-2xl
      bg-[#F4F7F5]
      flex
      items-center
      justify-center
      mb-4
      "
    >
      ✨
    </div>

    <h3
      className="
      font-semibold
      text-lg
      "
    >
      All quiet for now! 🌿
    </h3>

    <p
      className="
      text-sm
      text-gray-500
      mt-2
      max-w-xs
      "
    >
      When your group splits expenses,
      updates the itinerary or shares
      gallery photos, activity will
      appear here.
    </p>

  </div>

)}

    </div>
  );
};

export default RecentUpdatesCard;