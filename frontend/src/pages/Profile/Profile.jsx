import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { theme } from "../../common/common";

// Premium minimalistic vectors matching our corporate design identity ✨
import { ArrowLeft, Camera, Shield, Trash2, User, Mail, Lock, Loader2 } from "lucide-react";

const Profile = () => {
 const {
  user,
  refreshUser,
  logout
} = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] =
  useState(false);

  const [showPhotoMenu, setShowPhotoMenu] =
  useState(false);

const [showPhotoPreview, setShowPhotoPreview] =
  useState(false);

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

        <div className="max-w-3xl mx-auto">

  {/* Profile Header */}
  <div className="bg-white border border-gray-200/60 rounded-3xl p-8 shadow-xs mb-6">

    <div className="text-center">

      <div className="relative w-32 h-32 mx-auto group">

        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt=""
            className="
            w-full
            h-full
            rounded-full
            object-cover
            ring-4
            ring-gray-50
            border
            border-gray-100
            "
          />
        ) : (
          <div
            className="
            w-full
            h-full
            rounded-full
            bg-[#1E4631]
            text-white
            text-4xl
            font-extrabold
            flex
            items-center
            justify-center
            ring-4
            ring-[#1E4631]/10
            "
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        <button
          onClick={() =>
            setShowPhotoMenu(
              !showPhotoMenu
            )
          }
          className="
          absolute
          bottom-0
          right-0
          p-2
          bg-white
          border
          border-gray-200
          shadow-md
          rounded-xl
          "
        >
          {uploadingPhoto ? (
            <Loader2
              size={14}
              className="
              animate-spin
              text-[#1E4631]
              "
            />
          ) : (
            <Camera size={14} />
          )}
        </button>

        {showPhotoMenu && (

          <div
            className="
            absolute
            top-full
            left-1/2
            -translate-x-1/2
            mt-3
            w-44
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-xl
            overflow-hidden
            z-50
            "
          >

            {user?.profilePicture ? (

              <>
                <button
                  onClick={() => {

                    setShowPhotoPreview(
                      true
                    );

                    setShowPhotoMenu(
                      false
                    );

                  }}
                  className="
                  w-full
                  px-4
                  py-3
                  text-left
                  text-sm
                  hover:bg-gray-50
                  "
                >
                  View Photo
                </button>

                <label
                  className="
                  block
                  px-4
                  py-3
                  text-sm
                  cursor-pointer
                  hover:bg-gray-50
                  "
                >
                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      uploadProfilePicture
                    }
                    className="hidden"
                  />
                </label>
              </>

            ) : (

              <label
                className="
                block
                px-4
                py-3
                text-sm
                cursor-pointer
                hover:bg-gray-50
                "
              >
                Add Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    uploadProfilePicture
                  }
                  className="hidden"
                />
              </label>

            )}

          </div>

        )}

      </div>

      <h2
        className="
        mt-5
        text-xl
        font-bold
        text-gray-900
        "
      >
        {user?.name}
      </h2>

      <p
        className="
        text-sm
        text-gray-400
        mt-1
        "
      >
        {user?.email}
      </p>

      {!isEditing && (

  <div
    className="
    flex
    gap-3
    justify-center
    mt-8
    "
  >

    <button
      onClick={() =>
        setIsEditing(true)
      }
      className="
      bg-[#1E4631]
      text-white
      px-6
      py-3
      rounded-xl
      text-sm
      font-semibold
      "
    >
      Edit Profile
    </button>

    <button
      onClick={logout}
      className="
      bg-red-500
      text-white
      px-6
      py-3
      rounded-xl
      text-sm
      font-semibold
      "
    >
      Logout
    </button>

  </div>

)}

{isEditing && (

  <div
    className="
    mt-8
    pt-8
    border-t
    border-gray-100
    text-left
    "
  >

    <div className="space-y-4">

      <div>
        <label
          className="
          text-xs
          text-gray-400
          font-semibold
          "
        >
          Full Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="
          w-full
          mt-1
          px-4
          py-3
          border
          border-gray-200
          rounded-xl
          "
        />
      </div>

      <div>
        <label
          className="
          text-xs
          text-gray-400
          font-semibold
          "
        >
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="
          w-full
          mt-1
          px-4
          py-3
          border
          border-gray-200
          rounded-xl
          "
        />
      </div>

      <div
        className="
        pt-4
        border-t
        border-gray-100
        "
      >

        <h3
          className="
          text-sm
          font-bold
          text-gray-700
          mb-4
          "
        >
          Change Password
        </h3>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
          className="
          w-full
          mb-3
          px-4
          py-3
          border
          border-gray-200
          rounded-xl
          "
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          className="
          w-full
          px-4
          py-3
          border
          border-gray-200
          rounded-xl
          "
        />

      </div>

      <div
        className="
        flex
        gap-3
        pt-4
        "
      >

        <button
          onClick={saveProfile}
          className="
          bg-[#1E4631]
          text-white
          px-5
          py-3
          rounded-xl
          text-sm
          font-semibold
          "
        >
          Save Changes
        </button>

        <button
          onClick={updatePassword}
          className="
          bg-gray-100
          text-gray-700
          px-5
          py-3
          rounded-xl
          text-sm
          font-semibold
          "
        >
          Update Password
        </button>

        <button
          onClick={() => {

            setIsEditing(
              false
            );

            setName(
              user?.name || ""
            );

            setEmail(
              user?.email || ""
            );

            setCurrentPassword(
              ""
            );

            setNewPassword(
              ""
            );

          }}
          className="
          bg-red-50
          text-red-600
          px-5
          py-3
          rounded-xl
          text-sm
          font-semibold
          "
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  </div>

 

  
</div>

      </div>

      {showPhotoPreview && (

  <div
    onClick={() =>
      setShowPhotoPreview(
        false
      )
    }
    className="
    fixed
    inset-0
    bg-black/70
    z-50
    flex
    items-center
    justify-center
    p-6
    "
  >

    <img
      src={
        user?.profilePicture
      }
      alt=""
      className="
      max-h-[80vh]
      max-w-[80vw]
      rounded-2xl
      shadow-2xl
      "
    />

  </div>

)}
    </div>
  );
};

export default Profile;