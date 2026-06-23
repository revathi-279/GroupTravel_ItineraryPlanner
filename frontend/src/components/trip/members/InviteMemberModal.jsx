import { useState, useEffect } from "react";
import { theme } from "../../../common/common";
import { userService } from "../../../services/userService";
import { notificationService } from "../../../services/notificationService";
import UserSearchResult from "./UserSearchResult";
import MemberDrawer from "./MemberDrawer";
import { AnimatePresence } from "framer-motion";

import { Search, UserPlus, X, AlertCircle, Loader2 } from "lucide-react";

const InviteMemberModal = ({ open, onClose, trip, currentUser }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sentInvitations, setSentInvitations] = useState([]);

  const isAdmin = trip?.admins?.some((admin) => {
    const adminId = admin?._id || admin;
    return String(adminId) === String(currentUser?._id);
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open || !isAdmin) return null;

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await userService.searchUsers(value, trip._id);
      setResults(response.users || []);
    } catch (err) {
      console.log(err);
      setError("An error occurred while fetching search listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (user) => {
    try {
      setError("");
      await notificationService.sendInvitation(trip._id, user._id);
      setSentInvitations((prev) => [...prev, user._id]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to successfully dispatch invitation."
      );
    }
  };

  const handleCloseWrapper = () => {
    setQuery("");
    setResults([]);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Overlay Backdrop */}
      {/* Updated to bg-slate-900/20 to protect background color warmness and maintain perfect layout consistency */}
<div
  onClick={handleCloseWrapper}
  className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
/>
      {/* Main Structural Modal Content Box - Pure White Base */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EFE9DC] p-6 md:p-8 z-10 font-sans antialiased animate-in fade-in zoom-in-95 duration-150">
        
        {/* Absolute Close Action Header Button */}
        <button
          onClick={handleCloseWrapper}
          className="absolute right-6 top-6 p-2 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header Section */}
        <div className="mb-6 pr-8 select-none">
          <div className="flex items-center gap-2 text-[#2D6A4F] mb-1">
            <UserPlus size={18} />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Invite Member
            </h2>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Expand your crew. Search registered network profiles instantly by platform name or email.
          </p>
        </div>

        {/* Embedded Input Decoration Search Track with Sandalwood Tint */}
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username or email address..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-sm transition-all outline-none placeholder-stone-400 text-slate-800 focus:bg-white focus:border-[#2D6A4F]"
          />
        </div>

        {/* Context Error Notice Element Block - Refactored to Modern Pastel Look */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Inner Results Panel Lists Wrapper */}
        <div className="mt-6 space-y-1.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin divide-y divide-[#F5F0E6]">
          
          {/* Loading Animation Placeholder */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center gap-2.5 text-stone-400">
              <Loader2 size={20} className="animate-spin text-[#2D6A4F]" />
              <span className="text-xs font-semibold text-stone-400">Scanning database profiles...</span>
            </div>
          )}

          {/* Empty Fallback State */}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs font-semibold text-stone-400">
                No active user accounts matched your search keyword.
              </p>
            </div>
          )}

          {/* Core Results Loop */}
          {!loading &&
            results.map((user) => {
              const alreadyMember = trip?.members?.some(
                (member) => (member._id || member)?.toString() === user._id?.toString()
              );

              return (
                <div key={user._id} className="pt-2.5 first:pt-0">
                  <UserSearchResult
                    user={user}
                    alreadyMember={alreadyMember}
                    invitationSent={sentInvitations.includes(user._id)}
                    onInvite={handleInvite}
                    onOpenProfile={setSelectedUser}
                  />
                </div>
              );
            })}
        </div>
      </div>

      {/* Profile Detail Slide Drawer Target Layer */}
      <AnimatePresence>
        {selectedUser && (
          <MemberDrawer
            open={true}
            member={selectedUser}
            trip={trip}
            currentUser={currentUser}
            mode="invite"
            onClose={() => setSelectedUser(null)}
            onInvite={handleInvite}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InviteMemberModal;