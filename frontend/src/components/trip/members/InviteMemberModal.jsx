import { useState, useEffect } from "react";
import { theme } from "../../../common/common";
import { userService } from "../../../services/userService";
import { notificationService } from "../../../services/notificationService";
import UserSearchResult from "./UserSearchResult";
import MemberDrawer from "./MemberDrawer";
import { AnimatePresence } from "framer-motion";

// Premium minimalistic vectors matching our corporate design identity ✨
import { Search, UserPlus, X, AlertCircle, Loader2 } from "lucide-react";

const InviteMemberModal = ({ open, onClose, trip, currentUser }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sentInvitations, setSentInvitations] = useState([]);

  // Check permissions inline
  const isAdmin = trip?.admins?.some((admin) => {
    const adminId = admin?._id || admin;
    return String(adminId) === String(currentUser?._id);
  });

  // Handle Escape key closure shortcut
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
      <div
        onClick={handleCloseWrapper}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Main Structural Modal Content Box Layout */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 z-10 font-sans antialiased animate-in fade-in zoom-in-95 duration-150">
        
        {/* Absolute Close Action Header Button */}
        <button
          onClick={handleCloseWrapper}
          className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header Typography Section */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 text-[#1E4631] mb-1">
            <UserPlus size={18} />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Invite Member
            </h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Expand your crew. Search registered network profiles instantly by platform name or email.
          </p>
        </div>

        {/* Embedded Input Decoration Search Track */}
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username or email address..."
            className={`
              ${theme.inputs.search}
              w-full pl-10 pr-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 outline-none text-gray-800 placeholder-gray-400
            `}
          />
        </div>

        {/* Context Error Notice Element block */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Inner Results Panel Lists Wrapper */}
        <div className="mt-6 space-y-1.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar divide-y divide-gray-50">
          
          {/* Loading Animation Placeholder Element Row */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin text-[#1E4631]" />
              <span className="text-xs font-medium">Scanning database profiles...</span>
            </div>
          )}

          {/* Empty Fallback State Frame UI */}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs font-medium text-gray-400">
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