import { useState } from "react";
import { theme } from "../../../common/common";
import MemberDrawer from "./MemberDrawer";
import ConfirmationModal from "../../common/ConfirmationModel";
import InviteMemberModal from "./InviteMemberModal";
import { AnimatePresence } from "framer-motion";
import {
  useNavigate
}
from "react-router-dom";

import {
  tripService
}
from "../../../services/tripService";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Users, Search, UserPlus, ChevronRight, ShieldCheck } from "lucide-react";

const MembersCard = ({
  trip,
  currentUser,
  refreshTrip
}) => {
  const navigate =
  useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  // Check if current user is an admin
 const currentUserId =
  currentUser?._id ||
  currentUser?.id;

const isCurrentUserAdmin =
  trip?.admins?.some((admin) => {

    const adminId =
      admin?._id || admin;

    return (
      String(adminId) ===
      String(currentUserId)
    );
  });

  const openLeaveTripModal =
() => {

  setConfirmation({
    open: true,

    title:
      "Leave Trip",

    message:
      "Are you sure you want to leave this trip?",

    action:
      async () => {

        await tripService
          .leaveTrip(
            trip._id
          );

        navigate(
          "/dashboard"
        );
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
      action: () => {
        console.log("Promote Member to Admin ID:", member._id);
      },
    });
  };

  const openRemoveAdminModal = (member) => {
    setConfirmation({
      open: true,
      title: "Revoke Admin Rights",
      message: `"${member.name}" will lose administrative clearance controls but remain listed as an active trip participant.`,
      action: () => {
        console.log("Demote Admin Member ID:", member._id);
      },
    });
  };

  // Safe runtime filtering pipeline
  const filteredMembers = (trip?.members || []).filter((member) =>
    member?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Main Structural Layout Card container background */}
      <div className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-xs flex flex-col h-full font-sans antialiased text-gray-900">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 select-none">
          <div className="flex items-center gap-2 text-[#1E4631]">
            <Users size={16} />
            <h2 className="text-sm font-bold tracking-wider uppercase text-gray-400">
              Trip Crew
            </h2>
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md border border-gray-200/20">
            {trip?.members?.length || 0}
          </span>
        </div>

        {/* Search & Action Input Row Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter current crew..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          {isCurrentUserAdmin && (
            <button
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-[#1E4631] hover:bg-[#153122] text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-xs transition-all active:scale-[0.98] h-[34px]"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">Invite</span>
            </button>
          )}

           <button
    onClick={
      openLeaveTripModal
    }
    className="
    h-[34px]
    px-3
    rounded-xl
    text-xs
    font-semibold
    text-red-600
    border
    border-red-200
    hover:bg-red-50
    transition
    "
  >
    Leave Trip
  </button>

        </div>

        {/* Dynamic Crew Scrolling Stack Box Frame */}
        <div className="flex-1 max-h-[380px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar divide-y divide-gray-50/60">
          {filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-xs font-medium text-gray-400">
              No matching travelers found.
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isMemberAdmin = trip?.admins?.some(
                (admin) => (admin._id || admin) === member?._id
              );

              return (
                <div
                  key={member?._id}
                  onClick={() => setSelectedMember(member)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50/80 cursor-pointer transition-all duration-150 group pt-3 border-transparent"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* User Avatar Representation Fragment */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs flex-shrink-0 overflow-hidden ring-2 ring-gray-50">
                      {member?.profilePicture ? (
                        <img src={member.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="uppercase text-gray-400 text-[10px]">
                          {member?.name?.[0] || "U"}
                        </span>
                      )}
                    </div>

                    {/* Member Details Label */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 tracking-tight truncate max-w-[140px] mb-0.5">
                        {member?.name || "Traveler"}
                      </p>
                      {isMemberAdmin && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#1E4631]/5 text-[#1E4631] px-1.5 py-0.5 rounded-md">
                          <ShieldCheck size={10} className="text-[#1E4631]/70" />
                          <span>Admin</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Micro Inline Row Pointer Asset Chevron */}
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-600 transform group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Slide-out Sidebar Workspace Profile Inspector Drawer Overlay */}
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

      {/* Embedded Global Context Search Profiles Trigger Frame Drawer */}
      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        trip={trip}
        currentUser={currentUser}
      />

      {/* Security Checkpoints Assertion Warning Dialog Box */}
      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
        confirmText="Confirm"
        onClose={() => setConfirmation({ open: false, title: "", message: "", action: null })}
        onConfirm={async () => {

  await confirmation.action?.();

  setConfirmation({
    open: false,
    title: "",
    message: "",
    action: null,
  });

}}
      />
    </>
  );
};

export default MembersCard;