import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { theme } from "../../common/common";
import { motion, AnimatePresence } from "framer-motion";

// Premium minimalistic vectors matching our corporate design identity ✨
import { ArrowLeft, Camera, User, Mail, Lock, Loader2, X, Check, KeyRound, LogOut, Settings } from "lucide-react";

const Profile = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const photoMenuRef = useRef(null);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  // Handle clicking outside the floating profile picture options menu safely
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) {
        setShowPhotoMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) return;
    try {
      setSaving(true);
      await authService.updateProfile({ name: name.trim(), email: email.trim() });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      setChangingPassword(true);
      await authService.updateProfile({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  const uploadProfilePicture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setShowPhotoMenu(false);
      const formData = new FormData();
      formData.append("profilePicture", file);
      await authService.updateProfilePicture(formData);
      await refreshUser();
    } catch (error) {
      console.log(error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const cancelEdits = () => {
    setIsEditing(false);
    setName(user?.name || "");
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans antialiased text-slate-900 pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-8">
        
        {/* Navigation Back Link row */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D6A4F] hover:text-[#1B4332] transition-colors mb-6 group select-none"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
          <span>Back to Dashboard</span>
        </button>

        {/* Unified Single Profile Card Layout */}
        <div className="bg-white border border-[#EFE9DC] rounded-[32px] p-6 md:p-10 shadow-sm space-y-8">
          
          {/* Centered Profile Picture & User Info Summary Block */}
          <div className="flex flex-col items-center text-center select-none">
            <div className="relative w-28 h-28 mb-4 group" ref={photoMenuRef}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="w-28 h-28 rounded-full object-cover border border-[#EFE9DC] shadow-2xs"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#2D6A4F] text-white text-3xl font-black flex items-center justify-center border border-[#2D6A4F]">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                className="absolute bottom-1 right-1 p-2 bg-white border border-[#EFE9DC] shadow-md rounded-xl hover:bg-stone-50 transition-colors"
              >
                {uploadingPhoto ? (
                  <Loader2 size={13} className="animate-spin text-[#2D6A4F]" />
                ) : (
                  <Camera size={13} className="text-slate-700" />
                )}
              </button>

              {/* Floating Profile Picture Menu */}
              {showPhotoMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border border-[#EFE9DC] rounded-xl shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  {user?.profilePicture && (
                    <button
                      type="button"
                      onClick={() => { setShowPhotoPreview(true); setShowPhotoMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-[#FAF8F5] transition-colors"
                    >
                      View Photo
                    </button>
                  )}
                  <label className="block px-4 py-2 text-left text-xs font-bold text-[#2D6A4F] cursor-pointer hover:bg-[#FAF8F5] transition-colors border-t border-[#FAF8F5]">
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={uploadProfilePicture} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight px-1 leading-tight">
              {user?.name}
            </h2>
            <p className="text-xs font-semibold text-stone-400 mt-1.5 truncate px-1">
              {user?.email}
            </p>
          </div>

          <div className="border-t border-[#FAF8F5]" />

          {/* Account Details Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between select-none">
              <div className="flex items-center gap-2 text-[#2D6A4F]">
                <Settings size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Account Details
                </h3>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-[#2D6A4F] hover:underline uppercase tracking-wider"
                >
                  Edit Details
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none"><User size={12} /> Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold outline-none text-slate-800 focus:bg-white focus:border-[#2D6A4F] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 select-none"><Mail size={12} /> Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold outline-none text-slate-800 focus:bg-white focus:border-[#2D6A4F] transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-1 select-none">
                  <button
                    type="button"
                    disabled={saving || !name.trim() || !email.trim()}
                    onClick={saveProfile}
                    className="inline-flex items-center gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
                  >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={2.5} />}
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdits}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3.5 bg-[#FAF8F5] border border-[#EFE9DC]/60 rounded-xl min-w-0">
                  <User size={14} className="text-stone-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none mb-1 select-none">Full Name</p>
                    <p className="text-xs font-bold text-slate-800 truncate leading-none">{user?.name || "Not Set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#FAF8F5] border border-[#EFE9DC]/60 rounded-xl min-w-0">
                  <Mail size={14} className="text-stone-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 leading-none mb-1 select-none">Email Address</p>
                    <p className="text-xs font-bold text-slate-800 truncate leading-none">{user?.email || "Not Set"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#FAF8F5]" />

          {/* Security Update Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#2D6A4F] select-none">
              <KeyRound size={15} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Security Update
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="New Security Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl text-xs font-semibold outline-none text-slate-800 placeholder-stone-400 focus:bg-white focus:border-[#2D6A4F] transition-all"
                />
              </div>
            </div>

            <div className="pt-1 select-none">
              <button
                type="button"
                disabled={changingPassword || !currentPassword || !newPassword}
                onClick={updatePassword}
                className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#EFE9DC] hover:bg-stone-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shadow-2xs"
              >
                {changingPassword ? <Loader2 size={12} className="animate-spin text-[#2D6A4F]" /> : <Lock size={12} className="text-[#2D6A4F]" />}
                <span>Change Password</span>
              </button>
            </div>
          </div>

          <div className="border-t border-[#FAF8F5]" />

          {/* Bottom Action: Logout Button Section */}
          <div className="pt-2 select-none">
            <button
              type="button"
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut size={14} />
              <span>Logout Session</span>
            </button>
          </div>

        </div>

      </div>

      {/* Fullscreen profile photo preview mask zoom */}
      <AnimatePresence>
        {showPhotoPreview && (
          <div
            onClick={() => setShowPhotoPreview(false)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-6 cursor-zoom-out animate-in fade-in duration-200"
          >
            <img
              src={user?.profilePicture}
              alt=""
              className="max-h-[75vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-white/5 animate-in zoom-in-95 duration-150"
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;