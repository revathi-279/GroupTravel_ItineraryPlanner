import { useEffect, useState } from "react";

import {
  itineraryService
}
from "../../../services/itineraryService";

import {
  Calendar,
  Clock,
  MapPin
}
from "lucide-react";

const UpcomingEventCard = ({
  trip,
  onViewEvent
}) => {

  const [
    event,
    setEvent
  ] = useState(null);

  useEffect(() => {

    const load =
    async () => {

      try {

        const response =
          await itineraryService
            .getItineraries(
              trip._id
            );
const itineraries =
  response.allItineraries || [];

const upcoming =
  itineraries
    .filter(
      item =>
        item.status ===
        "Upcoming"
    )
    .sort(
      (a, b) =>
        new Date(
          a.dateTime
        ) -
        new Date(
          b.dateTime
        )
    )[0];

setEvent(
  upcoming || null
);

      } catch (error) {

        console.log(error);

      }

    };

    load();

  }, [trip]);

  return (

    <div
      className="
      bg-white
      border
      border-gray-200/60
      rounded-2xl
      p-5
      "
    >

      <h3
        className="
        text-xs
        uppercase
        tracking-widest
        font-bold
        text-gray-400
        mb-5
        "
      >
        Next On Your Journey
      </h3>

      {!event ? (

        <div
          className="
          py-8
          text-center
          "
        >

          <Calendar
            size={28}
            className="
            mx-auto
            text-gray-300
            "
          />

          <p
            className="
            text-sm
            text-gray-500
            mt-3
            "
          >
            Add itinerary events to keep your Journey organized
          </p>

        </div>

      ) : (

        <>

          <h2
            className="
            text-lg
            font-semibold
            text-gray-900
            "
          >
            {event.title}
          </h2>

          <div
            className="
            mt-4
            space-y-3
            text-sm
            text-gray-600
            "
          >

            <div
              className="
              flex
              items-center
              gap-2
              "
            >
              <Calendar size={15}/>
              {
                new Date(
                  event.dateTime
                ).toLocaleDateString()
              }
            </div>

            <div
              className="
              flex
              items-center
              gap-2
              "
            >
              <Clock size={15}/>
              {
                new Date(
                  event.dateTime
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )
              }
            </div>

            <div
              className="
              flex
              items-center
              gap-2
              "
            >
              <MapPin size={15}/>
              {event.location}
            </div>

            <button
  onClick={() =>
    onViewEvent?.(event)
  }
  className="
  mt-5
  text-sm
  font-semibold
  text-[#1E4631]
  hover:text-[#153122]
  transition
  "
>
  View Details →
</button>

          </div>

        </>

      )}

    </div>

  );

};

export default UpcomingEventCard;