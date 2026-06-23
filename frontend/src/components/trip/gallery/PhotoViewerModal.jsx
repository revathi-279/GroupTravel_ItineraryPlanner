import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryService } from "../../../services/galleryService";
import ConfirmationModal from "../../common/ConfirmationModel";
import ReactionsDrawer from "./ReactionsDrawer";

// Premium vector assets matching our luxury minimal identity ✨
import { X, MoreVertical, Check, ArrowRight, Smile, Trash2, Edit2 } from "lucide-react";

const PhotoViewerModal = ({
  photo,
  trip,
  currentUser,
  onRefresh,
  setSelectedPhoto,
  onClose,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(photo?.caption || "");
  const [showReactions, setShowReactions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);
  const captionRef = useRef(null);

  useEffect(() => {
    setShowMenu(false);
    setShowReactions(false);
    if (!editingCaption) {
      setCaption(photo?.caption || "");
    }
  }, [photo, editingCaption]);

  // Handle Escape key closure shortcut Safely
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle outside click tracking for editing captions input box frame
  useEffect(() => {
    const handleCaptionOutside = (event) => {
      if (
        editingCaption &&
        captionRef.current &&
        !captionRef.current.contains(event.target)
      ) {
        setEditingCaption(false);
        setCaption(photo?.caption || "");
      }
    };
    document.addEventListener("mousedown", handleCaptionOutside);
    return () => document.removeEventListener("mousedown", handleCaptionOutside);
  }, [editingCaption, photo]);

  // Handle context actions hamburger dropdown outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingCaption) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingCaption]);

  if (!photo) return null;

  const closeMenus = () => {
    setShowMenu(false);
    setShowReactions(false);
  };

  const currentUserId = currentUser?.id || currentUser?._id;
  const isUploader = (photo.uploadedBy?._id || photo.uploadedBy) === currentUserId;
  const isAdmin = trip?.admins?.some(
    (admin) => String(admin._id || admin) === String(currentUserId)
  );

  const userReaction = photo.reactions?.find(
    (reaction) => String(reaction.user?._id || reaction.user) === String(currentUserId)
  );

  const handleReaction = async (emoji) => {
    try {
      const existingReaction = photo.reactions?.find(
        (reaction) => String(reaction.user?._id || reaction.user) === String(currentUserId)
      );

      let updatedReactions = [...photo.reactions];

      if (existingReaction && existingReaction.emoji === emoji) {
        updatedReactions = updatedReactions.filter(
          (reaction) => String(reaction.user?._id || reaction.user) !== String(currentUserId)
        );
      } else {
        updatedReactions = updatedReactions.filter(
          (reaction) => String(reaction.user?._id || reaction.user) !== String(currentUserId)
        );
        updatedReactions.push({
          user: currentUser,
          emoji,
        });
      }

      setSelectedPhoto({
        ...photo,
        reactions: updatedReactions,
      });

      await galleryService.reactPhoto({
        photoId: photo._id,
        emoji,
      });

      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const getReactionCount = (emoji) => {
    return photo.reactions?.filter((reaction) => reaction.emoji === emoji).length || 0;
  };

  const totalReactions = photo.reactions?.length || 0;

  const saveCaption = async () => {
    try {
      await galleryService.updateCaption({
        photoId: photo._id,
        caption: caption.trim(),
      });
      setEditingCaption(false);
      await onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePhoto = async () => {
    try {
      await galleryService.deletePhoto(photo._id);
      onClose();
      await onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const formatUploadDate = (date) => {
    const uploaded = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const time = uploaded.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (uploaded.toDateString() === today.toDateString()) {
      return `Today at ${time}`;
    }
    if (uploaded.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${time}`;
    }

    return uploaded.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + ` at ${time}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans antialiased select-none">
      
      {/* Smooth Blurred Cinema Backdrop Overlay Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { closeMenus(); onClose(); }}
        className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md w-full h-full cursor-pointer"
      />

      {/* Core Layout Modal Window Framework Content Layer */}
      <div className="relative w-full h-full flex flex-col z-10 pointer-events-none">
        
        {/* Top Panel Header Alignment Grid row container */}
        <div className="w-full bg-neutral-950/40 border-b border-white/5 px-6 py-4 grid grid-cols-3 items-center select-none backdrop-blur-xs pointer-events-auto">
          
          {/* Left Block Side: Contributor profile tokens */}
          <div className="justify-self-start flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2D6A4F] border border-white/10">
              {photo.uploadedBy?.profilePicture ? (
                <img
                  src={photo.uploadedBy.profilePicture}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-black uppercase">
                  {photo.uploadedBy?.name?.[0] || "U"}
                </div>
              )}
            </div>

            <div className="leading-tight">
              <p className="text-xs font-bold text-white tracking-tight">
                {photo.uploadedBy?.name || "Traveler"}
              </p>
              <p className="text-[10px] font-medium text-stone-400 mt-0.5">
                {formatUploadDate(photo.createdAt)}
              </p>
            </div>
          </div>

          {/* Center Block Side: Dynamic Context Caption / Title logs text layout */}
          <div className="justify-self-center pointer-events-auto">
            {editingCaption ? (
              <div ref={captionRef} className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-100">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl outline-none focus:border-[#2D6A4F] transition-colors"
                  style={{ minWidth: "200px" }}
                />
                <button
                  type="button"
                  onClick={saveCaption}
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white p-2 rounded-xl transition-all shadow-2xs active:scale-95"
                >
                  <Check size={13} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <p className="text-white text-xs font-bold text-center max-w-[360px] md:max-w-[500px] break-words line-clamp-2 select-text px-2">
                {photo.caption || <span className="text-stone-500 font-medium italic select-none">No caption description added</span>}
              </p>
            )}
          </div>

          {/* Right Block Side: Standard Exit Actions trigger */}
          <div className="justify-self-end">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-stone-400 hover:text-white transition-all active:scale-95"
            >
              <X size={15} />
            </button>
          </div>

        </div>

        {/* Center Canvas Area: Media Preview Element Component */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center p-6 relative select-none">
          <img
            src={photo.imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-200"
          />
        </div>

        {/* Bottom Panel Component: Interactive Controls Footer Toolbar */}
        <div className="w-full bg-neutral-950/80 border-t border-white/5 px-6 py-4 flex items-center justify-between gap-6 pointer-events-auto backdrop-blur-xs select-none">
          
          {/* Left Segment: Modifiers Hamburger Dropdown Toggles Area */}
          <div ref={menuRef} className="relative min-w-[32px]">
            {(isUploader || isAdmin) && (
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 bg-white/5 border border-white/5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <MoreVertical size={15} />
              </button>
            )}

            {showMenu && (
              <div className="absolute bottom-full mb-2 left-0 w-44 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-1 overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150 origin-bottom-left">
                {isUploader && (
                  <button
                    type="button"
                    onClick={() => { setEditingCaption(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-200 hover:bg-white/5 transition-colors text-left"
                  >
                    <Edit2 size={13} className="text-stone-400" />
                    <span>{photo.caption ? "Modify Caption" : "Add Caption Descriptor"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left border-t border-neutral-800/60"
                >
                  <Trash2 size={13} />
                  <span>Remove Memory</span>
                </button>
              </div>
            )}
          </div>

          {/* Center Segment: Premium Reaction Pill Capsule Selection row list stack */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-[65vw]">
            {["❤️", "😍", "🔥", "👍"].map((emoji) => {
              const isActive = userReaction?.emoji === emoji;
              const count = getReactionCount(emoji);

              return (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 active:scale-95 shadow-2xs ${
                    isActive
                      ? "bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/10"
                      : "bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <span>{emoji}</span>
                  {count > 0 && <span className="text-[10px] font-bold text-white/80 font-sans">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Right Segment: Reactions Summary Modal Breakdown list drawer launcher Link trigger */}
          <div className="min-w-[110px] text-right">
            {totalReactions > 0 && (
              <button
                type="button"
                onClick={() => setShowReactions(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-white transition-colors group/btn"
              >
                <span>View Activity</span>
                <ArrowRight size={13} className="transform group-hover/btn:translate-x-0.5 transition-transform duration-200" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Global Security Warning Dialog Card block layer */}
      <ConfirmationModal
        open={showDeleteConfirm}
        title="Delete Photo"
        message="This trip memory asset will be permanently removed from the group gallery database timeline."
        confirmText="Delete"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await deletePhoto();
          setShowDeleteConfirm(false);
        }}
      />

      {/* Side Profile Reactions Checklist drawer slide element layer container */}
      <AnimatePresence>
        {showReactions && (
          <ReactionsDrawer photo={photo} onClose={() => setShowReactions(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default PhotoViewerModal;