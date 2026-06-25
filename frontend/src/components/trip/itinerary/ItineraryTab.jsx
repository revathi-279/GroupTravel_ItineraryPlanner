import { useEffect, useState } from "react";
import { itineraryService } from "../../../services/itineraryService";
import EmptyItinerary from "./EmptyItinerary";
import DayGroup from "./DayGroup";
import CreateEventModal from "./CreateEventModal";
import EventDrawer from "./EventDrawer";
import ConfirmationModal from "../../common/ConfirmationModel";
import EditEventModal from "./EditEventModal";
import { AnimatePresence } from "framer-motion";
import { Loader2, Plus, CalendarRange } from "lucide-react";

const ItineraryTab = ({ trip, currentUser }) => {
  const isAdmin = trip.admins?.some((admin) => {
    const adminId = admin?._id || admin;
    return String(adminId) === String(currentUser?._id);
  });

  const [itineraries, setItineraries] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const fetchItineraries = async () => {
    try {
      const response = await itineraryService.getItineraries(trip._id);
      setItineraries(response.allItineraries || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const openDeleteModal = (itinerary) => {
  // 1. Close the event drawer right away so it slides out cleanly
  setSelectedItinerary(null);

  // 2. Fire open the verification confirmation overlay card
  setConfirmation({
    open: true,
    title: "Delete Event",
    message: `${itinerary.title} will be permanently removed from this journey timeline.`,
    action: async () => {
      await itineraryService.deleteItinerary(itinerary._id);
      fetchItineraries();
    },
  });
};

  const openEditModal = (itinerary) => {
    setEditingItinerary(itinerary);
    setSelectedItinerary(null);
  };

  useEffect(() => {
    fetchItineraries();
  }, [trip]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-400 select-none font-sans antialiased">
        <Loader2 size={24} className="animate-spin text-[#2D6A4F]" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading timeline data...</span>
      </div>
    );
  }

 if (!itineraries || itineraries.length === 0) {
  return (
    <>
      <EmptyItinerary
        onCreate={() => setShowCreateModal(true)}
        isAdmin={isAdmin}
      />

      <CreateEventModal
        open={showCreateModal}
        trip={trip}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchItineraries}
      />
    </>
  );
}
  // Sorting timeline items sequentially before running map indexing
  const sortedItineraries = [...itineraries].sort(
    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
  );

  const groupedActivities = sortedItineraries.reduce((groups, activity) => {
    const day = new Date(activity.dateTime).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(activity);
    return groups;
  }, {});

  return (
    <div className="p-8 w-full max-w-5xl font-sans antialiased text-slate-900 mx-auto">
      
      {/* Tab Section Branding Header Area */}
      <div className="flex justify-between items-center mb-10 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Journey Timeline
          </h1>
          <p className="text-xs font-medium text-stone-400 mt-1.5 leading-relaxed">
            Every stop, activity, and plan curated for your shared adventure.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Journey Event</span>
          </button>
        )}
      </div>

      {/* Main Context Dynamic Timelines Grid Feed */}
      <div className="space-y-2">
        {Object.entries(groupedActivities).map(([day, activities]) => (
          <DayGroup
            key={day}
            day={day}
            activities={activities}
            onActivityClick={setSelectedItinerary}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Workflow Modals and Lifecycle Canvas Layers Stack */}
      <CreateEventModal
        open={showCreateModal}
        trip={trip}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchItineraries}
      />

      <EditEventModal
        open={!!editingItinerary}
        itinerary={editingItinerary}
        trip={trip}
        onClose={() => setEditingItinerary(null)}
        onUpdated={fetchItineraries}
      />

      {/* Smooth Side Sheet Canvas Sliders Lifecycle Animation Handler Container */}
      <AnimatePresence>
        {selectedItinerary && (
          <EventDrawer
            itinerary={selectedItinerary}
            trip={trip}
            currentUser={currentUser}
            onClose={() => setSelectedItinerary(null)}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onStatusUpdated={fetchItineraries}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
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
          await confirmation.action?.();
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