import {
  useEffect,
  useState,
} from "react";

import {
  pollService
}
from "../../../services/pollService";

import PollCard
from "./PollCard";

import EmptyPolls
from "./EmptyPolls";

import CreatePollModal
from "./CreatePollModal";

import PollDrawer
from "./PollDrawer";

import {
  AnimatePresence
}
from "framer-motion";

const PollsTab = ({
  trip,
  currentUser,
}) => {

  const [
    polls,
    setPolls
  ] = useState([]);

  const [
    showCreateModal,
    setShowCreateModal
  ] = useState(false);

const [
  selectedPoll,
  setSelectedPoll
] = useState(null);

  const fetchPolls =
    async () => {

      try {

        const response =
          await pollService
            .getPolls(
              trip._id
            );

        setPolls(
          response.allPolls || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchPolls();

  }, []);

  if (
    polls.length === 0
  ) {

    return (

      <>
        <EmptyPolls
          onCreate={() =>
            setShowCreateModal(
              true
            )
          }
        />

        <CreatePollModal
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
            fetchPolls
          }
        />
      </>

    );
  }

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
            Trip Polls
          </h1>

          <p
            className="
            text-gray-500
            "
          >
            Make decisions
            together.
          </p>

        </div>

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
          + Create Poll
        </button>

      </div>

      <div className="space-y-4">

        {polls.map(
          poll => (

            <PollCard
  key={poll._id}
  poll={poll}
  currentUser={currentUser}
  refreshPolls={fetchPolls}
  trip={trip}
  onViewVotes={
    setSelectedPoll
  }
/>

          )
        )}

      </div>

      <CreatePollModal
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
          fetchPolls
        }
      />

      <AnimatePresence>

  {selectedPoll && (

    <PollDrawer
      poll={selectedPoll}
      onClose={() =>
        setSelectedPoll(
          null
        )
      }
    />

  )}

</AnimatePresence>

      <AnimatePresence>

  {selectedPoll && (

    <PollDrawer
      poll={selectedPoll}
      onClose={() =>
        setSelectedPoll(null)
      }
    />

  )}

</AnimatePresence>

    </div>

  );
};

export default PollsTab;