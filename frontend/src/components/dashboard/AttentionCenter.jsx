import React from "react";
import { theme } from "../../common/common";
import { notificationService } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";
import { 
  MailOpen, 
  MapPin, 
  Users, 
  Hourglass, 
  ArrowRight, 
  Compass, 
  Check, 
  X,
  Sparkles
} from "lucide-react";

const AttentionCenter = ({
  pendingInvitation,
  activeTrip,
  upcomingTrip,
  onRefresh,
  onCreateTripClick,
  onOpenTrip
}) => {

  const navigate = useNavigate();

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

  if (pendingInvitation) {
    return (
      <div className="w-full relative overflow-hidden font-sans antialiased rounded-3xl p-8 bg-gradient-to-br from-[#E9F5ED] via-[#D8ECE0] to-[#C1E2CE] text-emerald-950 border border-[#B3D9C3] shadow-xs flex flex-col justify-between min-h-[220px]">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800/80 mb-3">
            <MailOpen size={14} />
            <span>Trip Invitation</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 leading-tight text-emerald-950">
            {pendingInvitation.sender?.name || "Someone"} invited you
          </h2>
          
          <p className="text-sm text-emerald-900/90 font-medium mb-6">
            To join the journey: <span className="underline decoration-emerald-800/40 underline-offset-4 font-semibold">{pendingInvitation.tripId?.title || "Untitled Adventure"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="flex items-center gap-1.5 bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs hover:bg-[#1B4332] active:scale-[0.98] transition-all duration-200"
          >
            <Check size={15} strokeWidth={2.5} />
            Accept
          </button>
          
          <button
            onClick={handleReject}
            className="flex items-center gap-1.5 bg-white/60 text-emerald-900 border border-emerald-300/60 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
          >
            <X size={15} />
            Decline
          </button>
        </div>
      </div>
    );
  }

  if (activeTrip) {
    return (
      <div className="w-full relative overflow-hidden font-sans antialiased rounded-3xl p-8 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white shadow-md flex flex-col justify-between min-h-[220px] group">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100/80 mb-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Journey In Progress</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
            {activeTrip.title}
          </h2>

          <div className="flex items-center gap-2 text-sm text-emerald-100/90 font-medium">
            <MapPin size={16} className="text-emerald-200/80" />
            <span>{activeTrip.destination}</span>
          </div>
        </div>

        <div>
          <button
  onClick={() =>
    onOpenTrip?.(
      activeTrip._id
    )
  }
  className="mt-6 flex items-center gap-2 text-sm font-bold text-[#1B4332] bg-white hover:bg-[#FDFBF7] px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200">
            Open Journey 
            <ArrowRight size={15} className="transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (!upcomingTrip) {
    return (
      <div className="w-full rounded-3xl p-8 bg-white border border-[#EFE9DC] shadow-xs flex flex-col justify-between min-h-[220px]">
        <div>
          <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-xl flex items-center justify-center mb-4 text-[#2D6A4F]">
            <Compass size={20} />
          </div>

          <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-1.5">
            Ready for your first journey?
          </h2>
          
          <p className="text-sm text-stone-500 max-w-md leading-relaxed mb-6">
            Create your first journey card to start planning itineraries, group splitting expenses, and collecting gallery memories together.
          </p>
        </div>

        <div>
          <button
            onClick={onCreateTripClick}
            className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-xs"
          >
            Create Journey
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(upcomingTrip.startDate);
  const today = new Date();
  const daysLeft = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full relative overflow-hidden font-sans antialiased rounded-3xl p-8 bg-gradient-to-br from-[#FFF9E6] via-[#FAF0D4] to-[#F3E5BC] text-amber-950 border border-[#E9DAAF] shadow-xs flex flex-col justify-between min-h-[220px] group">
      <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800/80 mb-3">
          <Hourglass size={13} />
          <span>Upcoming Journey</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight text-amber-950">
          {upcomingTrip.title}
        </h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-amber-900 bg-white/40 border border-amber-300/40 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-amber-800/80" />
            <span className="truncate max-w-[140px]">{upcomingTrip.destination}</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-amber-300/40 pl-4">
            <Users size={14} className="text-amber-800/80" />
            <span>{upcomingTrip.members?.length || 0} Members</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-amber-300/40 pl-4">
            <Sparkles size={14} className="text-amber-800/80" />
            <span>{daysLeft <= 0 ? "Starts Today" : `${daysLeft} days left`}</span>
          </div>
        </div>
      </div>

      <div>
        <button 
         onClick={() =>
    onOpenTrip?.(
      upcomingTrip._id
    )
  }
  className="mt-6 flex items-center gap-2 text-sm font-bold text-white bg-[#BC8A24] hover:bg-[#A3741A] px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200">
          Open Journey 
          <ArrowRight size={15} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default AttentionCenter;