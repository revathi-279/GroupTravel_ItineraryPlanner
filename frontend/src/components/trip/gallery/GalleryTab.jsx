import { useEffect, useState } from "react";
import { galleryService } from "../../../services/galleryService";

// Sub-component layout pipeline modules
import GalleryHero from "./GalleryHero";
import EmptyGallery from "./EmptyGallery";
import PhotoGrid from "./PhotoGrid";
import UploadPhotosModal from "./UploadPhotosModal";
import PhotoViewerModal from "./PhotoViewerModal";

// Premium vector assets matching our unified luxury minimal identity ✨
import { UploadCloud, Loader2 } from "lucide-react";

const GalleryTab = ({ trip, currentUser }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    try {
      const response = await galleryService.getPhotos(trip._id);
      const updatedPhotos = response.photos || [];
      setPhotos(updatedPhotos);

      // Keep active full-screen preview metrics synchronized dynamically
      if (selectedPhoto) {
        const updatedPhoto = updatedPhotos.find(
          (photo) => photo._id === selectedPhoto._id
        );
        if (updatedPhoto) {
          setSelectedPhoto({ ...updatedPhoto });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [trip._id]);

  // Poll for background data refreshes if comment or reaction overlays are open
  useEffect(() => {
    if (!selectedPhoto) return;

    const interval = setInterval(() => {
      fetchPhotos();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedPhoto]);

  // Premium inline skeleton loader frame
  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center gap-3 text-stone-400 select-none font-sans antialiased">
        <Loader2 size={24} className="animate-spin text-[#2D6A4F]" />
        <p className="text-xs font-bold tracking-wider uppercase">
          Assembling media timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-5xl font-sans antialiased text-slate-900 mx-auto space-y-8">
      
      {/* Top Layout Section: Overview Headers */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <GalleryHero photos={photos} />
        </div>

        {/* Display CTA utility button row conditionally if photos exist */}
        {photos.length > 0 && (
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] sm:mb-1"
          >
            <UploadCloud size={14} strokeWidth={2.5} />
            <span>Add Memories</span>
          </button>
        )}
      </div>

      {/* Main Framework Interactive Display Grid Canvas */}
      <div className="w-full">
        {photos.length === 0 ? (
          <div className="bg-white border border-[#EFE9DC] border-dashed rounded-3xl p-12 shadow-2xs">
            <EmptyGallery onUpload={() => setShowUpload(true)} />
          </div>
        ) : (
          <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />
        )}
      </div>

      {/* Hidden Asset Context Popup Modal Layers */}
      <UploadPhotosModal
        open={showUpload}
        trip={trip}
        onClose={() => setShowUpload(false)}
        onUploaded={fetchPhotos}
      />

      <PhotoViewerModal
        photo={selectedPhoto}
        currentUser={currentUser}
        trip={trip}
        onRefresh={fetchPhotos}
        setSelectedPhoto={setSelectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

    </div>
  );
};

export default GalleryTab;