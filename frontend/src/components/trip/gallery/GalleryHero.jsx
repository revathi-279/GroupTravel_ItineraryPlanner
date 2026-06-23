import React from "react";

// Premium minimalist vectors matching our unified design identity ✨
import { Camera, Image, Users, Clock } from "lucide-react";

const GalleryHero = ({ photos = [] }) => {
  // Safe set initialization for unique contributor parsing
  const contributors = new Set(
    photos.map((photo) => photo?.uploadedBy?._id || photo?.uploadedBy).filter(Boolean)
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
    <div className="w-full font-sans antialiased text-slate-900 select-none">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Side: Dynamic Workspace Titles */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Trip Memories
          </h1>
          <p className="text-xs font-medium text-stone-400 mt-1.5 leading-relaxed">
            Share and browse snapshots, high-resolution scenery logs, and visual updates with your travel group.
          </p>
        </div>

        {/* Right Side: Clean Horizontal Analytics Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600">
          
          {/* Photos Counter Tag */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EFE9DC] shadow-2xs">
            <Image size={14} className="text-stone-400" />
            <span className="text-slate-700 font-bold text-[11px]">
              {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          {/* Contributors Counter Tag */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EFE9DC] shadow-2xs">
            <Users size={14} className="text-stone-400" />
            <span className="text-slate-700 font-bold text-[11px]">
              {contributors} {contributors === 1 ? "Contributor" : "Contributors"}
            </span>
          </div>

          {/* Timestamp Analytics Tag */}
          <div className="flex items-center gap-1.5 bg-[#E9F5ED] px-3 py-1.5 rounded-xl border border-[#C1E2CE] text-[#2D6A4F] shadow-2xs">
            <Clock size={14} className="text-[#2D6A4F]/80" />
            <span className="text-[11px] font-bold">
              {latestPhoto ? `Updated ${latestUploadDate}` : "No Uploads"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GalleryHero;