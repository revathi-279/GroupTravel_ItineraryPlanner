import React from "react";

// Premium minimalist vectors matching our unified design identity ✨
import { Camera, Image, Users, Clock } from "lucide-react";

const GalleryHero = ({ photos = [] }) => {
  // Safe set initialization for unique contributor parsing
  const contributors = new Set(
    photos.map((photo) => photo?.uploadedBy?._id).filter(Boolean)
  ).size;

  const latestPhoto = photos[0];

  const latestUploadDate = latestPhoto?.createdAt
    ? new Date(latestPhoto.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No recent uploads";

  return (
    <div className="w-full font-sans antialiased text-gray-900 pb-4 border-b border-gray-200/60">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Side: Dynamic Workspace Titles */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#1E4631]">
            <Camera size={18} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1E4631]/80">
              Media Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Trip Memories
          </h1>
        </div>

        {/* Right Side: Clean Horizontal Analytics Badges */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-gray-500">
          
          {/* Photos Counter Tag */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/40 text-gray-700 shadow-xs">
            <Image size={14} className="text-gray-400" />
            <span>
              {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          {/* Contributors Counter Tag */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/40 text-gray-700 shadow-xs">
            <Users size={14} className="text-gray-400" />
            <span>
              {contributors} {contributors === 1 ? "Contributor" : "Contributors"}
            </span>
          </div>

          {/* Timestamp Analytics Tag */}
          <div className="flex items-center gap-1.5 bg-[#1E4631]/5 px-3 py-1.5 rounded-xl border border-[#1E4631]/10 text-[#1E4631] shadow-xs">
            <Clock size={14} className="text-[#1E4631]/70" />
            <span className="text-[11px]">
              {latestPhoto ? `Updated ${latestUploadDate}` : "No Uploads"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GalleryHero;