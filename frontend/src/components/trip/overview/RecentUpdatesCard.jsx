import { useEffect, useState } from "react";
import { activityService } from "../../../services/activityService";
import { Sparkles } from "lucide-react";
import ActivityDrawer from "./ActivityDrawer";

const RecentUpdatesCard = ({ trip, currentUser }) => {
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await activityService.getActivities(trip._id);
        setUpdates(response.activities || []);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [trip]);  

  const getMessage = (update) => {
    const isCurrentUser = update.user?._id?.toString() === currentUser?._id?.toString();
    const actor = isCurrentUser ? "You" : update.user?.name;

    switch (update.type) {
      case "gallery_uploaded":
        return `${actor} uploaded a photo`;
      case "expense_added":
      case "expense_settled":
      case "itinerary_status_updated":
        return update.message.replace(update.user?.name, actor);
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

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 min ago";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours === 1) return "1 hr ago";
    if (hours < 24) return `${hours} hr ago`;
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <div className="bg-white border border-[#EFE9DC] p-6 rounded-3xl shadow-xs h-full flex flex-col font-sans antialiased text-slate-900">
      
      {/* Card Header Section Title */}
      <div className="flex items-center gap-2 mb-5 select-none flex-shrink-0">
        <Sparkles size={16} className="text-[#2D6A4F]" />
        <h2 className="text-xs font-bold tracking-wider uppercase text-stone-400">
          Recent Updates
        </h2>
      </div>

      {/* Active Timeline List View */}
      {updates.length > 0 && (
        <div className="space-y-4 overflow-y-auto max-h-[500px] flex-1 pr-1 scrollbar-thin">
          {updates.slice(0, 5).map((update) => (
            <div key={update._id} className="flex gap-3.5 items-start">
              {update.user?.profilePicture ? (
                <img
                  src={update.user.profilePicture}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-[#EFE9DC] flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center font-bold text-xs text-stone-600 uppercase flex-shrink-0">
                  {update.user?.name?.[0] || "U"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 leading-normal">
                  {getMessage(update)}
                </p>
                <p className="text-[10px] font-medium text-stone-400 mt-0.5">
                  {getTimeAgo(update.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Drawer Toggle Trigger Link */}
      {updates.length > 5 && (
        <div className="pt-2 flex-shrink-0">
          <button
            onClick={() => setShowActivityDrawer(true)}
            className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
          >
            View All Activity →
          </button>
        </div>
      )}

      {/* Empty View State Alternative Layout */}
      {updates.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 select-none">
          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center mb-4">
            <Sparkles size={18} className="text-stone-400" />
          </div>

          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            All quiet for now!
          </h3>

          <p className="text-xs text-stone-400 mt-1.5 max-w-xs leading-relaxed font-medium">
            When your group splits expenses, updates the itinerary or shares gallery photos, activity will appear here.
          </p>
        </div>
      )}

      <ActivityDrawer
        open={showActivityDrawer}
        onClose={() => setShowActivityDrawer(false)}
        updates={updates}
        currentUser={currentUser}
      />
    </div>
  );
};

export default RecentUpdatesCard;