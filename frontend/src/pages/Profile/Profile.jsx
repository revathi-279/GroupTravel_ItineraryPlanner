import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { theme } from "../../common/common";

// Premium minimalistic vectors matching our corporate design identity ✨
import { ArrowLeft, Camera, Shield, Trash2, User, Mail, Lock, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      await authService.updateProfile({ name: name.trim(), email: email.trim() });
      await refreshUser();
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-gray-900 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Shortcut Back-Link */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4631] hover:text-[#153122] transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Master Content Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column Section: User Branding Meta Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 text-center shadow-xs space-y-5 select-none">
              <div className="relative w-32 h-32 mx-auto group">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt=""
                    className="w-full h-full rounded-full object-cover ring-4 ring-gray-50 border border-gray-100"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#1E4631] text-white text-4xl font-extrabold flex items-center justify-center ring-4 ring-[#1E4631]/10">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                
                {/* Floating Media Trigger Input Action Label */}
                <label className="absolute bottom-0 right-0 p-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-md rounded-xl cursor-pointer transition-all active:scale-90 text-gray-600 hover:text-gray-900">
                  {uploadingPhoto ? (
                    <Loader2 size={14} className="animate-spin text-[#1E4631]" />
                  ) : (
                    <Camera size={14} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadProfilePicture}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-extrabold tracking-tight text-gray-900 truncate px-2">
                  {user?.name || "Group Traveler"}
                </h2>
                <p className="text-xs text-gray-400 font-medium truncate px-2">
                  {user?.email}
                </p>
              </div>

              {uploadingPhoto && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E4631] animate-pulse">
                  Uploading image file...
                </p>
              )}
            </div>
          </div>

          {/* Right Column Section: Core Functional Forms Group */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Panel 1: Profile Properties Modification Area */}
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-gray-400 border-b border-gray-50 pb-3">
                <User size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Account Particulars
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 transition-all text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Mail size={12} className="text-gray-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 transition-all text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={saving || !name.trim() || !email.trim()}
                  onClick={saveProfile}
                  className="bg-[#1E4631] hover:bg-[#153122] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-[0.98] disabled:opacity-40"
                >
                  {saving ? "Saving Changes..." : "Save Identity Changes"}
                </button>
              </div>
            </div>

            {/* Panel 2: Credentials and Security Forms Area */}
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-gray-400 border-b border-gray-50 pb-3">
                <Shield size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Security Parameters
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Lock size={12} className="text-gray-400" /> Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 transition-all text-gray-800 placeholder-gray-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Lock size={12} className="text-gray-400" /> New Secret Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#1E4631] focus:ring-2 focus:ring-[#1E4631]/5 transition-all text-gray-800 placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={changingPassword || !currentPassword || !newPassword}
                  onClick={updatePassword}
                  className="bg-[#1E4631] hover:bg-[#153122] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-[0.98] disabled:opacity-40"
                >
                  {changingPassword ? "Updating Password..." : "Update Token Password"}
                </button>
              </div>
            </div>

            {/* Panel 3: Terminal Hazard Boundary Area */}
            <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-red-500 border-b border-red-50/60 pb-3 select-none">
                <Trash2 size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Danger Zone Terminal
                </h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium max-w-xl">
                  Permanently wipe your traveler profile profile parameters along with all your historical synchronized logs, split expenses networks, and active group canvas properties from our core systems.
                </p>
                <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-[0.98]">
                  Delete Identity Account
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;