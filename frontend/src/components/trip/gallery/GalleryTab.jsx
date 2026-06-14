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
  }, []);

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
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 size={24} className="animate-spin text-[#1E4631]" />
        <p className="text-xs font-semibold tracking-wide uppercase">
          Assembling media timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans antialiased text-gray-900 space-y-6">
      
      {/* Top Layout Section: Overview Headers */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <GalleryHero photos={photos} />
        </div>

        {/* Display CTA utility button row conditionally if photos exist */}
        {photos.length > 0 && (
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1E4631] hover:bg-[#153122] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all duration-200 active:scale-[0.98] sm:mb-1"
          >
            <UploadCloud size={14} strokeWidth={2.5} />
            <span>Add Memories</span>
          </button>
        )}
      </div>

      {/* Main Framework Interactive Display Grid Canvas */}
      <div className="w-full pt-2">
        {photos.length === 0 ? (
          <div className="bg-white border border-gray-200/60 border-dashed rounded-3xl p-12 shadow-xs">
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