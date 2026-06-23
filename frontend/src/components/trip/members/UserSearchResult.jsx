import React from "react";
import { theme } from "../../../common/common";
import { UserPlus, CheckCircle2, User } from "lucide-react";

const UserSearchResult = ({
  user,
  alreadyMember,
  invitationSent,
  onInvite,
  onOpenProfile,
}) => {
  const isPending = user?.invitationPending || invitationSent;

  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#EFE9DC] transition-all duration-200 font-sans antialiased gap-4"
    >
      {/* Left Area: Clickable User Identity Block */}
      <div
        onClick={() => onOpenProfile?.(user)}
        className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0 group"
      >
        {/* Dynamic Avatar Profile Shape */}
        <div className="w-9 h-9 rounded-full bg-stone-50 border border-[#EFE9DC] flex items-center justify-center text-stone-600 font-bold text-xs flex-shrink-0 overflow-hidden transition-colors group-hover:border-[#2D6A4F]/40">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="uppercase text-stone-400 group-hover:text-[#2D6A4F] transition-colors">
              {user?.name?.[0] || <User size={13} />}
            </span>
          )}
        </div>

        {/* Name and Meta Subtitle Track */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate tracking-tight group-hover:text-[#2D6A4F] transition-colors leading-none mb-1">
            {user?.name || "Anonymous User"}
          </p>
          <p className="text-[11px] text-stone-400 font-medium truncate leading-none">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Right Area: Conditional State Button Action Frame */}
      <div className="flex-shrink-0 flex items-center justify-end min-w-[96px]">
        {alreadyMember ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-400 px-2.5 py-1 rounded-md border border-stone-200/40">
            Crew Member
          </span>
        ) : isPending ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#E9F5ED] text-[#2D6A4F] border border-[#C1E2CE] px-2.5 py-1 rounded-md animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 size={12} strokeWidth={2.5} />
            <span>Invited</span>
          </span>
        ) : (
          <button
            onClick={() => onInvite?.(user)}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide shadow-xs transition-all active:scale-[0.97]"
          >
            <UserPlus size={13} />
            <span>Invite</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default UserSearchResult;