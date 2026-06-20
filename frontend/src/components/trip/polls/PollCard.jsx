import {
  useState,
  useRef,
  useEffect
} from "react";
import { pollService } from "../../../services/pollService";

import ConfirmationModal
from "../../common/ConfirmationModel";

// Clean premium vector icons matching our application look ✨
import {
  BarChart3,
  User,
  CheckCircle2,
  Circle,
  ArrowRight,
  MoreVertical,
  Trash2
} from "lucide-react";

const PollCard = ({
  poll,
  currentUser,
  refreshPolls,
  trip,
  onViewVotes,
}) => {
  const [loading, setLoading] = useState(false);

  const [showMenu, setShowMenu] =
  useState(false);

  const [
  showEditExpiryModal,
  setShowEditExpiryModal
] = useState(false);

const [
  expiryDate,
  setExpiryDate
] = useState(
  poll.expiresAt
    ? new Date(
        poll.expiresAt
      )
      .toISOString()
      .slice(0, 16)
    : ""
);

  const menuRef =
  useRef(null);

  const [
  showDeleteModal,
  setShowDeleteModal
] = useState(false);

  useEffect(() => {

  const handleClickOutside =
    (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {

        setShowMenu(
          false
        );

      }

    };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  );

  const isAdmin = trip?.admins?.some(
    (admin) => admin._id === currentUser?._id
  );

  const isCreator =
  poll.createdBy?._id ===
  currentUser?._id;

const canDelete =
  isAdmin || isCreator;

  const isClosed =

  poll.expiresAt &&

  new Date() >
  new Date(
    poll.expiresAt
  );

const expiryText =

  poll.expiresAt

    ? new Date(
        poll.expiresAt
      ).toLocaleString(
        undefined,
        {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        }
      )

    : null;

  const handleVote = async (optionId) => {
    if (loading) return;
    try {
      setLoading(true);
      await pollService.votePoll({
        pollId: poll._id,
        optionId,
      });
      refreshPolls();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleDelete =
async () => {

  try {

    await pollService
      .deletePoll(
        poll._id
      );

    setShowDeleteModal(
      false
    );

    refreshPolls();

  } catch (error) {

    console.log(error);

  }

};

const handleUpdateExpiry =
async () => {

  try {

    await pollService
      .updatePollExpiry(
        poll._id,
        expiryDate || null
      );

    setShowEditExpiryModal(
      false
    );

    refreshPolls();

  } catch (error) {

    console.log(error);

  }

};

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 font-sans antialiased group">
      
      {/* Top Section: Header & Meta Details */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex-1">

  <div className="flex items-center gap-3 mb-4">

    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100">

      {poll.createdBy?.profilePicture ? (

        <img
          src={poll.createdBy.profilePicture}
          alt=""
          className="w-full h-full object-cover"
        />

      ) : (

        <div
          className="
          w-full
          h-full
          flex
          items-center
          justify-center
          font-semibold
          "
        >
          {poll.createdBy?.name?.[0]}
        </div>

      )}

    </div>

    <div>

      <p
        className="
        text-sm
        font-semibold
        text-gray-900
        "
      >
        {poll.createdBy?.name}
      </p>

      <p
        className="
        text-xs
        text-gray-400
        "
      >
        {new Date(
  poll.createdAt
).toLocaleDateString(
  undefined,
  {
    month: "short",
    day: "numeric",
    year: "numeric"
  }
)}
      </p>

    </div>

  </div>

  <h3
    className="
    text-lg
    font-bold
    text-gray-900
    "
  >
    {poll.question}
  </h3>

  <div
  className="
  flex
  items-center
  gap-2
  mt-3
  "
>

  <span
    className={`
      text-[10px]
      font-bold
      uppercase
      tracking-wider
      px-2.5
      py-1
      rounded-md
      ${
        poll.allowMultipleVotes
          ? "bg-[#1E4631]/5 text-[#1E4631]"
          : "bg-gray-100 text-gray-500"
      }
    `}
  >
    {isClosed
  ? "Voting Closed"
  : poll.allowMultipleVotes
    ? "Select One Or More"
    : "Select One"}
  </span>

</div>

</div>

        </div>

        <div
  className="
  flex
  items-center
  gap-2
  "
>

  <div
  className="
  flex
  flex-col
  items-end
  gap-1
  "
>

  <span
    className={`
      text-[10px]
      font-bold
      uppercase
      px-2.5
      py-1
      rounded-md

      ${
        isClosed
          ? "bg-red-50 text-red-600"
          : "bg-green-50 text-green-700"
      }
    `}
  >
    {isClosed
  ? "Closed"
  : expiryText
    ? "Active Until"
    : "Active"}
  </span>

 {expiryText && (

  <span
    className="
    text-[10px]
    text-gray-400
    "
  >
    {isClosed
      ? `Ended ${expiryText}`
      : `Ends ${expiryText}`
    }
  </span>

)}

</div>

  {canDelete && (

    <div
  ref={menuRef}
  className="
  relative
  "
>

      <button
        onClick={() =>
          setShowMenu(
            !showMenu
          )
        }
      >
        <MoreVertical
          size={16}
        />
      </button>

      {showMenu && (

        <div
          className="
          absolute
          right-0
          top-7
          bg-white
          border
          rounded-xl
          shadow-lg
          z-20
          "
        >

          <button
  onClick={() => {

    setShowMenu(
      false
    );

    setShowEditExpiryModal(
      true
    );

  }}
  className="
  flex
  items-center
  gap-2
  px-4
  py-3
  text-sm
  hover:bg-gray-50
  "
>
  Edit Poll Time
</button>

          <button
            onClick={() => {

  setShowMenu(
    false
  );

  setShowDeleteModal(
    true
  );

}}
            className="
            flex
            items-center
            gap-2
            px-4
            py-3
            text-red-600
            text-sm
            hover:bg-red-50
            "
          >
            <Trash2 size={14} />
            Delete Poll
          </button>

        </div>

      )}

    </div>

  )}

</div>
      </div>

      {/* Center Section: Interactive Options List */}
      <div className="mt-6 space-y-3">
        {poll.options.map((option) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
          const hasVoted = option.votes.some((vote) => vote._id === currentUser?._id);

          return (
            <button
              key={option._id}
              disabled={
  loading ||
  isClosed
}
              onClick={() => handleVote(option._id)}
             className={`

w-full
text-left
relative
overflow-hidden
border
rounded-xl
p-3.5
transition-all
duration-200
flex
flex-col
justify-between

${
  isClosed

    ? "opacity-60 cursor-not-allowed"

    : ""
}

${
  hasVoted
    ? "border-[#1E4631] bg-[#1E4631]/[0.02]"
    : "border-gray-200/80 hover:bg-gray-50/50 hover:border-gray-300"
}
`}
            >
              <div className="w-full flex items-center justify-between gap-4 mb-2.5 z-10">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                  <div className="flex-shrink-0 transition-transform active:scale-95 duration-150">
                    {hasVoted ? (
                      <CheckCircle2 size={16} className="text-[#1E4631]" />
                    ) : (
                      <Circle size={16} className="text-gray-300 group-hover/option:text-gray-400" />
                    )}
                  </div>
                  <span className={hasVoted ? "text-[#1E4631] font-bold" : "font-medium"}>
                    {option.text}
                  </span>
                </div>
                
              </div>

              {/* Seamless Dynamic Micro-Progress Track Layer Bar */}
              <div className="w-full h-1.5 bg-gray-100/70 rounded-full overflow-hidden relative">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    hasVoted ? "bg-[#1E4631]" : "bg-gray-400/80"
                  }`}
                />
              </div>
<div
  className="
  flex
  items-center
  justify-end
  gap-2
  mt-2
  "
>

  <div
    className="
    flex
    -space-x-3
    "
  >

    {option.votes
      .slice(-3)
      .map(voter => (

        <div
          key={voter._id}
          className="
          w-8
          h-8
          rounded-full
          border-2
          border-white
          overflow-hidden
          "
        >

          {voter.profilePicture ? (

            <img
              src={voter.profilePicture}
              alt=""
              className="
              w-full
              h-full
              object-cover
              "
            />

          ) : (

            <div
              className="
              w-full
              h-full
              bg-[#EAF3ED]
              flex
              items-center
              justify-center
              text-[10px]
              font-semibold
              "
            >
              {voter.name?.[0]}
            </div>

          )}

        </div>

      ))}

  </div>

  <span
    className="
    text-xs
    font-semibold
    text-gray-600
    "
  >
    {option.votes.length}
  </span>

</div>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Total Counter & Audit Log View Details Action */}
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-400">
  {
    new Set(
      poll.options.flatMap(
        option =>
          option.votes.map(
            vote => vote._id
          )
      )
    ).size
  }
  {" of "}
  {trip.members.length}
  {" members voted"}
</span>

        <button
          onClick={() => onViewVotes?.(poll)}
          className="flex items-center gap-1 text-xs font-bold text-[#1E4631] hover:text-[#153122] hover:underline underline-offset-4 transition-all"
        >
          <span>View Votes Breakdown</span>
          <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {
showEditExpiryModal && (

<div
  className="
  fixed
  inset-0
  bg-black/40
  flex
  items-center
  justify-center
  z-50
  "
>

  <div
    className="
    bg-white
    rounded-2xl
    p-6
    w-full
    max-w-md
    "
  >

    <h3
      className="
      text-lg
      font-bold
      mb-4
      "
    >
      Edit Poll End Time
    </h3>

    <input
      type="datetime-local"
      value={expiryDate}
      onChange={(e) =>
        setExpiryDate(
          e.target.value
        )
      }
      className="
      w-full
      border
      rounded-xl
      p-3
      "
    />

    <button
      onClick={() =>
        setExpiryDate("")
      }
      className="
      mt-3
      text-sm
      text-red-600
      "
    >
      Remove End Time
    </button>

    <div
      className="
      flex
      justify-end
      gap-3
      mt-6
      "
    >

      <button
        onClick={() =>
          setShowEditExpiryModal(
            false
          )
        }
      >
        Cancel
      </button>

      <button
        onClick={
          handleUpdateExpiry
        }
        className="
        bg-[#1E4631]
        text-white
        px-4
        py-2
        rounded-xl
        "
      >
        Save
      </button>

    </div>

  </div>

</div>

)}

      <ConfirmationModal
  open={showDeleteModal}
  title="Delete Poll"
  message="
    Are you sure you want
    to delete this poll?
    This action cannot
    be undone.
  "
  confirmText="Delete"
  cancelText="Cancel"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onClose={() =>
    setShowDeleteModal(
      false
    )
  }
/>

    </div>
  );
};

export default PollCard;