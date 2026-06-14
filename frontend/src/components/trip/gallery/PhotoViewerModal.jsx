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

  useEffect(() => {
    setShowMenu(false);
    setShowReactions(false);
    setCaption(photo?.caption || "");
  }, [photo]);

  // Handle Escape key closure shortcut
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Dropdown closure hook
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!photo) return null;

  const closeMenus = () => {
    setShowMenu(false);
    setShowReactions(false);
  };

  const isUploader = photo.uploadedBy?._id === currentUser?._id;
  const isAdmin = trip?.admins?.some(
    (admin) => (admin._id || admin).toString() === currentUser?._id
  );

  const userReaction = photo.reactions?.find(
    (reaction) => reaction.user?._id === currentUser?._id
  );

  const handleReaction = async (emoji) => {
    try {
      const existingReaction = photo.reactions?.find(
        (reaction) => reaction.user?._id === currentUser?._id
      );

      let updatedReactions = [...photo.reactions];

      if (existingReaction && existingReaction.emoji === emoji) {
        updatedReactions = updatedReactions.filter(
          (reaction) => reaction.user?._id !== currentUser?._id
        );
      } else {
        updatedReactions = updatedReactions.filter(
          (reaction) => reaction.user?._id !== currentUser?._id
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { closeMenus(); onClose(); }}
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col font-sans antialiased"
      >
        {/* Core Layout Modal Window Framework Wrapper */}
        <div onClick={(e) => e.stopPropagation()} className="w-full h-full flex flex-col justify-between">
          
          {/* Top Panel: Header Navigation Bar */}
          <div className="w-full bg-gradient-to-b from-black/60 to-transparent px-6 py-4 flex items-center justify-between z-10 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1E4631] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
                {photo.uploadedBy?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-tight">{photo.uploadedBy?.name || "Traveler"}</p>
                <p className="text-[10px] font-medium text-gray-400">Shared Trip Memory</p>
              </div>
            </div>

            {/* Central Caption Layout Container Area */}
            {(photo.caption || editingCaption || isUploader) && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-[40vw] hidden md:block">
                {editingCaption ? (
                  <div className="flex items-center gap-2 bg-neutral-900/80 p-1.5 rounded-xl border border-white/10 shadow-xl">
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Caption this memory..."
                      className="bg-transparent text-xs text-white outline-none px-2 py-1 w-48 font-medium"
                      autoFocus
                    />
                    <button
                      onClick={saveCaption}
                      className="p-1.5 bg-[#1E4631] rounded-lg text-white hover:bg-[#153122] transition-colors"
                    >
                      <Check size={12} strokeWidth={3} />
                    </button>
                  </div>
                ) : photo.caption ? (
                  <p className="text-sm font-semibold tracking-tight text-white/95 truncate px-4">
                    {photo.caption}
                  </p>
                ) : (
                  isUploader && (
                    <button
                      onClick={() => setEditingCaption(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={12} />
                      <span>Add custom caption memory...</span>
                    </button>
                  )
                )}
              </div>
            )}

            {/* Header Close Shortcut Action Target Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Center Panel: Primary Media View Canvas */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center bg-black/40 p-4 relative select-none">
            <img
              src={photo.imageUrl}
              alt=""
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            />
          </div>

          {/* Bottom Panel: Dynamic Global Footer Toolbar */}
          <div className="w-full bg-neutral-950/80 border-t border-white/5 px-6 py-4 z-10 flex items-center justify-between gap-4">
            
            {/* Left Frame: Context Operations Hamburger Dropdown Area */}
            <div ref={menuRef} className="relative member-menu-container min-w-[32px]">
              {(isUploader || isAdmin) && (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <MoreVertical size={16} />
                </button>
              )}

              {showMenu && (
                <div className="absolute bottom-12 left-0 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 origin-bottom-left">
                  {isUploader && (
                    <button
                      onClick={() => { setEditingCaption(true); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/5 transition-colors text-left"
                    >
                      <Edit2 size={13} className="text-gray-400" />
                      <span>{photo.caption ? "Edit Caption" : "Add Caption"}</span>
                    </button>
                  )}
                  {(isUploader || isAdmin) && (
                    <button
                      onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <Trash2 size={13} />
                      <span>Delete Photo</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Center Frame: Premium Reaction Pill Selector Stack */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[65vw] no-scrollbar py-0.5">
              {["❤️", "😍", "🔥", "👍"].map((emoji) => {
                const isActive = userReaction?.emoji === emoji;
                const count = getReactionCount(emoji);

                return (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-150 active:scale-95 shadow-xs border ${
                      isActive
                        ? "bg-[#1E4631] text-white border-[#1E4631] shadow-md shadow-[#1E4631]/10"
                        : "bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span>{emoji}</span>
                    {count > 0 && <span className="text-xs font-semibold text-white/80 font-sans">{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Right Frame: Audit Logs Reactions Analytics Drawer Trigger */}
            <div className="min-w-[110px] text-right">
              {totalReactions > 0 && (
                <button
                  onClick={() => setShowReactions(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white transition-all hover:underline underline-offset-4 group"
                >
                  <span>Reactions</span>
                  <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Global Security Context Remove Warning Dialog Block */}
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

        {/* Dynamic Participant Breakdown Slider Panel Frame */}
        <AnimatePresence>
          {showReactions && (
            <ReactionsDrawer photo={photo} onClose={() => setShowReactions(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoViewerModal;