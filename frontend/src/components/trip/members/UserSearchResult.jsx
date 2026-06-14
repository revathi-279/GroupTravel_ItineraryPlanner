import React from "react";
import { theme } from "../../../common/common";

// Premium minimalist vectors matching our unified dashboard layout ✨
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
      className="
        flex items-center justify-between p-3.5 rounded-xl 
        hover:bg-gray-50/80 border border-transparent hover:border-gray-100/40
        transition-all duration-200 font-sans antialiased gap-4
      "
    >
      {/* Left Area: Clickable User Identity Block */}
      <div
        onClick={() => onOpenProfile?.(user)}
        className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0 group"
      >
        {/* Dynamic Avatar Core Profile Shape */}
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs flex-shrink-0 overflow-hidden transition-colors group-hover:border-[#1E4631]/30">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="uppercase text-gray-500 group-hover:text-[#1E4631] transition-colors">
              {user?.name?.[0] || <User size={13} />}
            </span>
          )}
        </div>

        {/* Name and Meta Subtitle Track */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate tracking-tight group-hover:text-[#1E4631] transition-colors leading-none mb-1">
            {user?.name || "Anonymous User"}
          </p>
          <p className="text-[11px] text-gray-400 font-medium truncate leading-none">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Right Area: Conditional State Button Action Frame */}
      <div className="flex-shrink-0 flex items-center justify-end min-w-[96px]">
        {alreadyMember ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400 px-2.5 py-1 rounded-md border border-gray-200/20">
            Crew Member
          </span>
        ) : isPending ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#1E4631]/5 text-[#1E4631] px-2.5 py-1 rounded-md animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 size={12} strokeWidth={2.5} />
            <span>Invited</span>
          </span>
        ) : (
          <button
            onClick={() => onInvite?.(user)}
            className={`
              ${theme?.buttons?.primary}
              inline-flex items-center gap-1 bg-[#1E4631] hover:bg-[#153122] text-white px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-[0.97] shadow-xs
            `}
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