import React from "react";
import { theme } from "../../common/common";
import { notificationService } from "../../services/notificationService";

// Premium lucide-react icons used to build premium SaaS dashboards ✨
import { 
  MailOpen, 
  MapPin, 
  Users, 
  Hourglass, 
  ArrowRight, 
  Compass, 
  Check, 
  X 
} from "lucide-react";

const AttentionCenter = ({
  pendingInvitation,
  activeTrip,
  upcomingTrip,
  onRefresh,
  onCreateTripClick // Hook added to trigger your new premium create modal seamlessly
}) => {

  const handleAccept = async () => {
    try {
      await notificationService.acceptInvitation(pendingInvitation._id);
      onRefresh?.();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      await notificationService.rejectInvitation(pendingInvitation._id);
      onRefresh?.();
    } catch (error) {
      console.log(error);
    }
  };

  // State 1: Render Dynamic Pending Trip Invitation Card
  if (pendingInvitation) {
    return (
      <div className={`${theme.cards.attentionPrimary} bg-[#2F6F4E] text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-[#2F6F4E]/10 relative overflow-hidden font-sans antialiased`}>
        {/* Decorative subtle abstract background glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 mb-3">
          <MailOpen size={14} className="text-white/80" />
          <span>Trip Invitation</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 leading-tight">
          {pendingInvitation.sender?.name || "Someone"} invited you
        </h2>
        
        <p className="text-sm text-white/90 font-medium mb-6">
          To join the journey: <span className="underline decoration-white/40 underline-offset-4 font-semibold">{pendingInvitation.tripId?.title || "Untitled Adventure"}</span>
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="flex items-center gap-1.5 bg-white text-[#2F6F4E] px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
          >
            <Check size={15} strokeWidth={2.5} />
            Accept
          </button>
          
          <button
            onClick={handleReject}
            className="flex items-center gap-1.5 bg-transparent text-white border border-white/30 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
          >
            <X size={15} />
            Decline
          </button>
        </div>
      </div>
    );
  }

  // State 2: Render Live Journey In Progress Card
  if (activeTrip) {
    return (
      <div className={`${theme.cards.attentionPrimary} bg-[#2F6F4E] text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-[#2F6F4E]/10 relative overflow-hidden font-sans antialiased group`}>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 mb-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <span>Journey In Progress</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
          {activeTrip.title}
        </h2>

        <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
          <MapPin size={16} className="text-white/70" />
          <span>{activeTrip.destination}</span>
        </div>

        <button className="mt-6 flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all duration-200">
          Open Journey 
          <ArrowRight size={15} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  // State 3: Render Secondary Empty State Blank Canvas Card
  if (!upcomingTrip) {
    return (
      <div className={`${theme.cards.attentionSecondary} bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-xs text-left max-w-xl font-sans antialiased`}>
        <div className="w-12 h-12 bg-[#2F6F4E]/10 rounded-2xl flex items-center justify-center mb-5 text-[#2F6F4E]">
          <Compass size={24} />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-2">
          Ready for your first journey?
        </h2>
        
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Create your first journey card to start planning itineraries, group splitting expenses, and collecting gallery memories together.
        </p>

        <button
          onClick={onCreateTripClick}
          className={`${theme.buttons.primary} bg-[#2F6F4E] text-white px-6 py-3 font-semibold rounded-xl text-sm shadow-md shadow-[#2F6F4E]/10 hover:bg-[#23543b] active:scale-[0.99] transition-all duration-200`}
        >
          Create Journey
        </button>
      </div>
    );
  }

  // State 4: Render Standard Active Upcoming Journey Meta Card
  const startDate = new Date(upcomingTrip.startDate);
  const today = new Date();
  const daysLeft = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className={`${theme.cards.attentionPrimary} bg-[#2F6F4E] text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-[#2F6F4E]/10 relative overflow-hidden font-sans antialiased group`}>
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 mb-3">
        <Hourglass size={13} className="text-white/80 animate-pulse" />
        <span>Upcoming Journey</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
        {upcomingTrip.title}
      </h2>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/90 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-white/70" />
          <span className="truncate max-w-[140px]">{upcomingTrip.destination}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-white/70" />
          <span>{upcomingTrip.members?.length || 0} Members</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Hourglass size={14} className="text-white/70" />
          <span>{daysLeft <= 0 ? "Starts Today" : `${daysLeft} days left`}</span>
        </div>
      </div>

      <button className="mt-6 flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all duration-200">
        Open Journey 
        <ArrowRight size={15} className="transform group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default AttentionCenter;