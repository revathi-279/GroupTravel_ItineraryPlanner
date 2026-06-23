import { X, Search, ShieldCheck } from "lucide-react";

const MembersModal = ({
  open,
  onClose,
  members,
  currentUser,
  admins,
  onMemberClick,
  searchQuery,
  setSearchQuery
}) => {

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-[650px] bg-white rounded-3xl shadow-xl border border-[#EFE9DC] overflow-hidden flex flex-col font-sans antialiased text-slate-900"
      >
        {/* Header Section - Pure White Base */}
        <div className="flex items-center justify-between p-6 border-b border-[#F5F0E6] bg-white select-none">
          <h2 className="font-bold text-lg text-slate-800 tracking-tight">
            Members
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body - Set to Pure White to maintain strict modal consistency */}
        <div className="p-6 flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* Modern Filter Input Layout with subtle Sandalwood accent background */}
          <div className="relative mb-5 flex-shrink-0">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm outline-none placeholder-stone-400 text-slate-800 focus:bg-white focus:border-[#2D6A4F] transition-all"
            />
          </div>

          {/* Members Scroll View Area */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {members.map(member => {
              const isAdmin = admins.some(
                admin => String(admin._id || admin) === String(member._id)
              );

              return (
                <button
                  key={member._id}
                  onClick={() => onMemberClick(member)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#EFE9DC] transition-all duration-150 group"
                >
                  {/* User Avatar Representation Graphic */}
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-100 border border-[#EFE9DC] flex-shrink-0">
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 font-bold text-sm uppercase">
                        {member.name?.[0]}
                      </div>
                    )}
                  </div>

                  {/* Core Member Details Label */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-sm text-slate-800 tracking-tight truncate group-hover:text-[#2D6A4F] transition-colors">
                      {String(member._id) === String(currentUser?._id)
                        ? `${member.name} (You)`
                        : member.name}
                    </p>

                    {isAdmin && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#E9F5ED] text-[#2D6A4F] px-1.5 py-0.5 rounded-md mt-1 select-none">
                        <ShieldCheck size={10} />
                        <span>Admin</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MembersModal;