import { useState, useRef, useEffect } from "react";
import { pollService } from "../../../services/pollService";
import ConfirmationModal from "../../common/ConfirmationModel";

// Clean premium vector icons matching our application look ✨
import { BarChart3, User, CheckCircle2, Circle, ArrowRight, MoreVertical, Trash2 } from "lucide-react";

const PollCard = ({
  poll,
  currentUser,
  refreshPolls,
  trip,
  onViewVotes,
}) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditExpiryModal, setShowEditExpiryModal] = useState(false);
  const menuRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [expiryDate, setExpiryDate] = useState(
    poll.expiresAt
      ? new Date(poll.expiresAt).toISOString().slice(0, 16)
      : ""
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  );

  const currentUserId = currentUser?.id || currentUser?._id;
  const isAdmin = trip?.admins?.some(
    (admin) => (admin._id || admin) === currentUserId
  );
  const isCreator = (poll.createdBy?._id || poll.createdBy) === currentUserId;
  const canDelete = isAdmin || isCreator;

  const isClosed = poll.expiresAt && new Date() > new Date(poll.expiresAt);

  const expiryText = poll.expiresAt
    ? new Date(poll.expiresAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      })
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

  const handleDelete = async () => {
    try {
      await pollService.deletePoll(poll._id);
      setShowDeleteModal(false);
      refreshPolls();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateExpiry = async () => {
    try {
      await pollService.updatePollExpiry(poll._id, expiryDate || null);
      setShowEditExpiryModal(false);
      refreshPolls();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border border-[#EFE9DC] rounded-3xl p-6 shadow-2xs hover:shadow-xs hover:border-[#2D6A4F]/30 transition-all duration-200 font-sans antialiased text-slate-900 group">
      
      {/* Top Section: Header & Meta Details */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex-1">
            
            <div className="flex items-center gap-3 mb-4 select-none">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-50 border border-[#EFE9DC]">
                {poll.createdBy?.profilePicture ? (
                  <img
                    src={poll.createdBy.profilePicture}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-stone-400 text-xs uppercase">
                    {poll.createdBy?.name?.[0]}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                  {poll.createdBy?.name}
                </p>
                <p className="text-xs font-semibold text-stone-400 leading-none">
                  {new Date(poll.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight break-words">
              {poll.question}
            </h3>

            <div className="flex items-center gap-2 mt-3 select-none">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                isClosed ? "bg-stone-50 border-stone-200 text-stone-400" :
                poll.allowMultipleVotes ? "bg-[#E9F5ED] border-[#C1E2CE] text-[#2D6A4F]" :
                "bg-[#FAF8F5] border-[#EFE9DC] text-stone-500"
              }`}>
                {isClosed
                  ? "Voting Closed"
                  : poll.allowMultipleVotes
                    ? "Select One Or More"
                    : "Select One"}
              </span>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-2 select-none flex-shrink-0">
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
              isClosed ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-[#E9F5ED] border-[#C1E2CE] text-[#2D6A4F]"
            }`}>
              {isClosed
                ? "Closed"
                : expiryText
                  ? "Active Until"
                  : "Active"}
            </span>

            {expiryText && (
              <span className="text-[10px] font-semibold text-stone-400">
                {isClosed ? `Ended ${expiryText}` : `Ends ${expiryText}`}
              </span>
            )}
          </div>

          {canDelete && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#EFE9DC] rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-150 origin-top-right">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowEditExpiryModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-[#FAF8F5] hover:text-[#2D6A4F] flex items-center gap-2 transition-colors"
                  >
                    Edit Poll Time
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-[#FAF8F5]"
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
          const hasVoted = option.votes.some((vote) => (vote._id || vote) === currentUserId);

          return (
            <button
              type="button"
              key={option._id}
              disabled={loading || isClosed}
              onClick={() => handleVote(option._id)}
              className={`w-full text-left relative overflow-hidden border rounded-xl p-3.5 transition-all duration-200 flex flex-col justify-between group/option ${
                isClosed ? "opacity-60 cursor-not-allowed" : ""
              } ${
                hasVoted
                  ? "border-[#2D6A4F] bg-[#E9F5ED]/10"
                  : "border-[#EFE9DC] hover:bg-[#FAF8F5] hover:border-stone-300"
              }`}
            >
              <div className="w-full flex items-center justify-between gap-4 mb-2.5 z-10">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                  <div className="flex-shrink-0 transition-transform active:scale-95 duration-150">
                    {hasVoted ? (
                      <CheckCircle2 size={16} className="text-[#2D6A4F]" />
                    ) : (
                      <Circle size={16} className="text-stone-300 group-hover/option:text-stone-400" />
                    )}
                  </div>
                  <span className={hasVoted ? "text-[#2D6A4F] font-bold" : "font-medium"}>
                    {option.text}
                  </span>
                </div>
              </div>

              {/* Seamless Dynamic Micro-Progress Track Layer Bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden relative select-none">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    hasVoted ? "bg-gradient-to-r from-[#2D6A4F] to-[#40916C]" : "bg-stone-400/80"
                  }`}
                />
              </div>

              {/* Restored Original Facepile Layout Exactly */}
              <div className="flex items-center justify-end gap-2 mt-2 select-none z-10">
                <div className="flex -space-x-3 overflow-hidden">
                  {option.votes.slice(-3).map((voter) => (
                    <div
                      key={voter._id || Math.random()}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-stone-50"
                    >
                      {voter.profilePicture ? (
                        <img
                          src={voter.profilePicture}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center text-[10px] font-bold uppercase text-stone-400">
                          {voter.name?.[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <span className="text-xs font-bold text-slate-600 bg-[#FAF8F5] border border-[#EFE9DC] px-1.5 py-0.5 rounded">
                  {option.votes.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Total Counter & Audit Log View Details Action */}
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-[#FAF8F5] select-none">
        <span className="text-xs font-semibold text-stone-400">
          {
            new Set(
              poll.options.flatMap((option) =>
                option.votes.map((vote) => vote._id || vote)
              )
            ).size
          }
          {" of "}
          {trip.members.length}
          {" members voted"}
        </span>

        <button
          type="button"
          onClick={() => onViewVotes?.(poll)}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] group/btn transition-colors"
        >
          <span>View Votes Breakdown</span>
          <ArrowRight
            size={13}
            className="transform group-hover/btn:translate-x-0.5 transition-transform duration-200"
          />
        </button>
      </div>

      {/* Structured Expiry Modal matching Corporate Theme */}
      {showEditExpiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowEditExpiryModal(false)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity" />
          
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] p-6 z-10 font-sans text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-800 tracking-tight mb-4">
              Edit Poll End Time
            </h3>

            <input
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#2D6A4F] transition-all"
            />

            <button
              type="button"
              onClick={() => setExpiryDate("")}
              className="mt-3 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors block"
            >
              Remove End Time
            </button>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setShowEditExpiryModal(false)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateExpiry}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
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
        message="Are you sure you want to delete this poll? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />

    </div>
  );
};

export default PollCard;