import { useState } from "react";
import { theme } from "../../../common/common";
import MemberDrawer from "./MemberDrawer";
import ConfirmationModal from "../../common/ConfirmationModel";
import InviteMemberModal from "./InviteMemberModal";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { tripService } from "../../../services/tripService";
import MembersModal from "./MembersModal";

import { Users, Search, UserPlus, ChevronRight, ShieldCheck } from "lucide-react";

const MembersCard = ({
  trip,
  currentUser,
  refreshTrip
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const [showMembersModal, setShowMembersModal] = useState(false);

  const currentUserId = currentUser?._id || currentUser?.id;

  const isCurrentUserAdmin = trip?.admins?.some((admin) => {
    const adminId = admin?._id || admin;
    return String(adminId) === String(currentUserId);
  });

  const openLeaveTripModal = () => {
    setConfirmation({
      open: true,
      title: "Leave Trip",
      message: "Are you sure you want to leave this trip?",
      action: async () => {
        await tripService.leaveTrip(trip._id);
        navigate("/dashboard");
      }
    });
  };

  const openRemoveMemberModal = (member) => {
    setConfirmation({
      open: true,
      title: "Remove Crew Member",
      message: `"${member.name}" will lose absolute access to this shared journey workspace, including schedules, gallery histories, team polls, and expense split balances.`,
      action: () => {
        console.log("Remove Member Dispatch ID:", member._id);
      },
    });
  };

  const openMakeAdminModal = (member) => {
    setConfirmation({
      open: true,
      title: "Grant Admin Privileges",
      message: `"${member.name}" will receive full administrative clearings and modifying rights for this workspace timeline.`,
      action: async () => {
        await tripService.addAdmin({
          tripId: trip._id,
          memberId: member._id
        });
        await refreshTrip();
      }
    });
  };

  const openRemoveAdminModal = (member) => {
    setConfirmation({
      open: true,
      title: "Revoke Admin Rights",
      message: `"${member.name}" will lose administrative clearance controls but remain listed as an active trip participant.`,
      action: async () => {
        await tripService.removeAdmin(trip._id, member._id);
        await refreshTrip();
      }
    });
  };

  const creatorId = String(trip?.createdBy?._id);
  const normalizedCurrentUserId = String(currentUserId);
  
  const sortedMembers = [...(trip?.members || [])]
    .sort((a, b) => {
      const aIsYou = String(a._id) === String(currentUserId);
      const bIsYou = String(b._id) === String(currentUserId);
      if (aIsYou) return -1;
      if (bIsYou) return 1;
      return a.name.localeCompare(b.name);
    });

  const filteredMembers = sortedMembers.filter(
    member =>
      member?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Container Refined to Match Sandalwood Pastel Grid Aesthetic */}
      <div className="bg-white border border-[#EFE9DC] p-6 rounded-3xl shadow-xs flex flex-col h-full font-sans antialiased text-slate-900">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 select-none">
          <div className="flex items-center gap-2 text-[#2D6A4F]">
            <Users size={16} />
            <h2 className="text-xs font-bold tracking-wider uppercase text-stone-400">
              Trip Crew
            </h2>
          </div>
          <span className="bg-[#EFE9DC] text-[#2D6A4F] text-xs font-bold px-2.5 py-0.5 rounded-full">
            {trip?.members?.length || 0}
          </span>
        </div>

        {/* Input Row Controls */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Filter current crew..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs outline-none focus:bg-white focus:border-[#2D6A4F] text-slate-800 placeholder-stone-400 transition-all"
            />
          </div>

          {isCurrentUserAdmin && (
            <button
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-xs transition-all active:scale-[0.98] h-[34px]"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">Invite</span>
            </button>
          )}

          <button
            onClick={openLeaveTripModal}
            className="h-[34px] px-3 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors"
          >
            Leave Trip
          </button>
        </div>

        {/* Crew List Stack */}
        <div className="space-y-1 flex-1">
          {filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-xs font-medium text-stone-400">
              No matching travelers found.
            </div>
          ) : (
            filteredMembers.slice(0, 5).map((member) => {
              const isMemberAdmin = trip?.admins?.some(
                admin => String(admin._id || admin) === String(member._id)
              );

              return (
                <div
                  key={member?._id}
                  onClick={() => setSelectedMember(member)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-stone-100 border border-[#EFE9DC] flex items-center justify-center text-stone-600 font-bold text-xs flex-shrink-0 overflow-hidden">
                      {member?.profilePicture ? (
                        <img src={member.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="uppercase text-stone-400 text-[10px]">
                          {member?.name?.[0] || "U"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[140px]">
                        {String(member?._id) === String(currentUserId) ? `${member.name} (You)` : member.name}
                      </p>
                      {isMemberAdmin && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#E9F5ED] text-[#2D6A4F] px-1.5 py-0.5 rounded-md mt-0.5">
                          <ShieldCheck size={10} />
                          <span>Admin</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-600 transform group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })
          )}
        </div>

        {trip.members.length > 5 && (
          <button
            onClick={() => setShowMembersModal(true)}
            className="w-full mt-4 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] text-center transition-colors"
          >
            View all ({trip.members.length - 5} more)
          </button>
        )}
      </div>

      {/* Drawer Overlay Anchor Container */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDrawer
            open={true}
            member={selectedMember}
            trip={trip}
            currentUser={currentUser}
            onClose={() => setSelectedMember(null)}
            onMakeAdmin={openMakeAdminModal}
            onRemoveAdmin={openRemoveAdminModal}
            onRemoveMember={openRemoveMemberModal}
          />
        )}
      </AnimatePresence>

      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        trip={trip}
        currentUser={currentUser}
      />

      <MembersModal
        open={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={filteredMembers}
        admins={trip.admins}
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMemberClick={member => {
          setSelectedMember(member);
          setShowMembersModal(false);
        }}
      />

      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
        confirmText="Confirm"
        onClose={() => setConfirmation({ open: false, title: "", message: "", action: null })}
        onConfirm={async () => {
          await confirmation.action?.();
          setConfirmation({ open: false, title: "", message: "", action: null });
        }}
      />
    </>
  );
};

export default MembersCard;