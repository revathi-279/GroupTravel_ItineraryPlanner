import { useEffect, useState } from "react";
import { pollService } from "../../../services/pollService";
import PollCard from "./PollCard";
import EmptyPolls from "./EmptyPolls";
import CreatePollModal from "./CreatePollModal";
import PollDrawer from "./PollDrawer";
import { AnimatePresence } from "framer-motion";
import { Loader2, Plus } from "lucide-react";

const PollsTab = ({ trip, currentUser }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);

  const fetchPolls = async () => {
    try {
      const response = await pollService.getPolls(trip._id);
      setPolls(response.allPolls || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [trip._id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-400 select-none font-sans antialiased">
        <Loader2 size={24} className="animate-spin text-[#2D6A4F]" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading coordination matrix...</span>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <>
        <EmptyPolls onCreate={() => setShowCreateModal(true)} />

        <CreatePollModal
          open={showCreateModal}
          trip={trip}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchPolls}
        />
      </>
    );
  }

  return (
    <div className="p-8 w-full max-w-5xl font-sans antialiased text-slate-900 mx-auto">
      
      {/* Top Header Section Actions Bar */}
      <div className="flex justify-between items-center mb-10 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Trip Polls
          </h1>
          <p className="text-xs font-medium text-stone-400 mt-1.5 leading-relaxed">
            Make shared choices, coordinate dinner spots, and align timelines across your travel crew.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Create Poll</span>
        </button>
      </div>

      {/* Main Streamlined Interactive Cards Collection Feed */}
      <div className="space-y-4">
        {polls.map((poll) => (
          <PollCard
            key={poll._id}
            poll={poll}
            currentUser={currentUser}
            refreshPolls={fetchPolls}
            trip={trip}
            onViewVotes={setSelectedPoll}
          />
        ))}
      </div>

      {/* Creation Configuration Sheet Layout Modal Overlay */}
      <CreatePollModal
        open={showCreateModal}
        trip={trip}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchPolls}
      />

      {/* Dynamic Responses Facepile Details Drawer Track Canvas */}
      <AnimatePresence>
        {selectedPoll && (
          <PollDrawer
            poll={selectedPoll}
            onClose={() => setSelectedPoll(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default PollsTab;