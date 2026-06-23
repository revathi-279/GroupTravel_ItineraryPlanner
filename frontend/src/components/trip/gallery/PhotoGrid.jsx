import React from "react";
import PhotoCard from "./PhotoCard";

const PhotoGrid = ({ photos = [], onPhotoClick }) => {
  
  // Guard clause to prevent rendering errors if data array is uninitialized
  if (!photos || photos.length === 0) return null;

  return (
    <div
      className="
        columns-1 sm:columns-2 lg:columns-3 
        gap-5 [column-fill:_balance] w-full mx-auto pb-6
        animate-in fade-in duration-300 font-sans antialiased select-none
      "
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo._id}
          photo={photo}
          onClick={onPhotoClick}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;