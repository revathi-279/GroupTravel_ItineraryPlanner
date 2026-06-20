import { useEffect, useState }
from "react";

import { itineraryService }
from "../../../services/itineraryService";

import EmptyItinerary
from "./EmptyItinerary";

import DayGroup
from "./DayGroup";

import CreateEventModal
from "./CreateEventModal";

import EventDrawer
from "./EventDrawer";

import ConfirmationModal
from "../../common/ConfirmationModel";

import EditEventModal from "./EditEventModal";

import {
  AnimatePresence
}
from "framer-motion";


const ItineraryTab = ({
  trip,
  currentUser,
}) => {

 const isAdmin =
  trip.admins?.some(
    admin => {

      const adminId =
        admin?._id || admin;

      return (
        String(adminId) ===
        String(currentUser?._id)
      );
    }
  );

  const [
    itineraries,
    setItineraries
  ] = useState([]);

  const [
  showCreateModal,
  setShowCreateModal
] = useState(false);

const [
  selectedItinerary,
  setSelectedItinerary
] = useState(null);

const [
  confirmation,
  setConfirmation
] = useState({
  open: false,
  title: "",
  message: "",
  action: null,
});

const [
  editingItinerary,
  setEditingItinerary
] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);


   const fetchItineraries =
    async () => {

      try {

        const response =
          await itineraryService
            .getItineraries(
              trip._id
            );

       setItineraries(
  response.allItineraries || []
);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    const openDeleteModal =
  (itinerary) => {

    setConfirmation({
      open: true,

      title:
        "Delete Event",

      message:
        `${itinerary.title} will be permanently removed from this journey timeline.`,

      action:
        async () => {

          await itineraryService
            .deleteItinerary(
              itinerary._id
            );

          fetchItineraries();

          setSelectedItinerary(
            null
          );
        }
    });
  };

  const openEditModal =
  (itinerary) => {

    setEditingItinerary(
      itinerary
    );

    setSelectedItinerary(
      null
    );
  };

  useEffect(() => {

    fetchItineraries();

  }, [trip]);


  if (loading) {

    return (
      <p>
        Loading itinerary...
      </p>
    );
  }

  if (
  !itineraries ||
  itineraries.length === 0
) {

    return (
      <EmptyItinerary
        onCreate={() =>
          console.log(
            "open modal"
          )
        }
      />
    );
  }

  const groupedActivities =
  itineraries.reduce(
    (
      groups,
      activity
    ) => {

      const day =
        new Date(
          activity.dateTime
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );

      if (
        !groups[day]
      ) {

        groups[day] = [];
      }

      groups[day].push(
        activity
      );

      return groups;

    },
    {}
  );

  return (

  <div>

    <div
      className="
      flex
      justify-between
      items-center
      mb-8
      "
    >

      <div>

        <h1
          className="
          text-3xl
          font-bold
          "
        >
          Journey Timeline
        </h1>

        <p
          className="
          text-gray-500
          mt-1
          "
        >
          Every stop,
          activity and plan
          for your adventure.
        </p>

      </div>

   {isAdmin && (

  <button
    onClick={() =>
      setShowCreateModal(
        true
      )
    }
    className="
    bg-[#2F6F4E]
    text-white
    px-5
    py-3
    rounded-2xl
    "
  >
    + Add Journey Event
  </button>

)}

    </div>

    {Object.entries(
      groupedActivities
    ).map(
      ([day, activities]) => (

        <DayGroup
          key={day}
          day={day}
          activities={
            activities
          }
          onActivityClick={
  setSelectedItinerary
}
        />

      )
    )}

    <CreateEventModal
  open={
    showCreateModal
  }
  trip={trip}
  onClose={() =>
    setShowCreateModal(
      false
    )
  }
  onCreated={
    fetchItineraries
  }
/>

<EditEventModal
  open={
    !!editingItinerary
  }

  itinerary={
    editingItinerary
  }

  trip={trip}

  onClose={() =>
    setEditingItinerary(
      null
    )
  }

  onUpdated={
    fetchItineraries
  }
/>

<AnimatePresence>

  {selectedItinerary && (

   <EventDrawer
  itinerary={selectedItinerary}
  trip={trip}
  currentUser={currentUser}
  onClose={() =>
    setSelectedItinerary(null)
  }
  onEdit={openEditModal}
  onDelete={openDeleteModal}
  onStatusUpdated={
    fetchItineraries
  }
/>

  )}

</AnimatePresence>

<ConfirmationModal
  open={
    confirmation.open
  }

  title={
    confirmation.title
  }

  message={
    confirmation.message
  }

  confirmText="Delete"

  onClose={() =>
    setConfirmation({
      open: false,
      title: "",
      message: "",
      action: null,
    })
  }

  onConfirm={async () => {

    await confirmation
      .action?.();

    setConfirmation({
      open: false,
      title: "",
      message: "",
      action: null,
    });

  }}
/>

  </div>

);
};

export default ItineraryTab;