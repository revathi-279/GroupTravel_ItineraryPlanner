import { useState } from "react";
import { pollService } from "../../../services/pollService";

// Clean premium vector icons matching our application look ✨
import { BarChart3, User, CheckCircle2, Circle, ArrowRight } from "lucide-react";

const PollCard = ({
  poll,
  currentUser,
  refreshPolls,
  trip,
  onViewVotes,
}) => {
  const [loading, setLoading] = useState(false);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  );

  const isAdmin = trip?.admins?.some(
    (admin) => admin._id === currentUser?._id
  );

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

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 font-sans antialiased group">
      
      {/* Top Section: Header & Meta Details */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          {/* Question Topic Heading */}
          <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug">
            {poll.question}
          </h3>

          {/* Creator Signature Block Profile */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
              {poll.createdBy?.profilePicture ? (
                <img src={poll.createdBy.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold uppercase">{poll.createdBy?.name?.[0]}</span>
              )}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              By {poll.createdBy?.name || "Group Member"}
            </span>
          </div>
        </div>

        {/* Choice Configuration Tag Badge */}
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex-shrink-0 ${
          poll.allowMultipleVotes 
            ? "bg-[#1E4631]/5 text-[#1E4631]" 
            : "bg-gray-100 text-gray-500"
        }`}>
          {poll.allowMultipleVotes ? "Multiple Choice" : "Single Choice"}
        </span>
      </div>

      {/* Center Section: Interactive Options List */}
      <div className="mt-6 space-y-3">
        {poll.options.map((option) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
          const hasVoted = option.votes.some((vote) => vote._id === currentUser?._id);

          return (
            <button
              key={option._id}
              disabled={loading}
              onClick={() => handleVote(option._id)}
              className={`w-full text-left relative overflow-hidden border rounded-xl p-3.5 transition-all duration-200 flex flex-col justify-between group/option ${
                hasVoted
                  ? "border-[#1E4631] bg-[#1E4631]/[0.02]"
                  : "border-gray-200/80 hover:bg-gray-50/50 hover:border-gray-300"
              }`}
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
                
                {/* Individual Votes Meta Count */}
                <span className="text-xs font-bold text-gray-400 group-hover/option:text-gray-700 transition-colors">
                  {option.votes.length} {option.votes.length === 1 ? "vote" : "votes"} ({percentage}%)
                </span>
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
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Total Counter & Audit Log View Details Action */}
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-400">
          Total of <span className="font-bold text-gray-700">{totalVotes}</span> response{totalVotes === 1 ? "" : "s"} submitted
        </span>

        <button
          onClick={() => onViewVotes?.(poll)}
          className="flex items-center gap-1 text-xs font-bold text-[#1E4631] hover:text-[#153122] hover:underline underline-offset-4 transition-all"
        >
          <span>View Votes Breakdown</span>
          <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default PollCard;