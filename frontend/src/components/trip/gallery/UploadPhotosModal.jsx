import { useState, useEffect } from "react";
import { galleryService } from "../../../services/galleryService";

// Premium minimalistic vectors matching our corporate design identity ✨
import { X, Plus, UploadCloud, Trash2, Image as ImageIcon } from "lucide-react";

const UploadPhotosModal = ({ open, trip, onClose, onUploaded }) => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setSelectedPhotos([]);
    }
  }, [open]);

  // Handle Escape key closure shortcut Safely
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setSelectedPhotos([]);
    onClose();
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);

    const photos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setSelectedPhotos((prev) => {
      const updated = [...prev, ...photos].slice(0, 20);
      setActiveIndex(updated.length - 1);
      return updated;
    });
  };

  const removePhoto = (index) => {
    const updated = selectedPhotos.filter((_, i) => i !== index);
    setSelectedPhotos(updated);

    if (activeIndex >= updated.length) {
      setActiveIndex(Math.max(0, updated.length - 1));
    }
  };

  const updateCaption = (index, value) => {
    const updated = [...selectedPhotos];
    if (updated[index]) {
      updated[index].caption = value;
      setSelectedPhotos(updated);
    }
  };

  const uploadPhotos = async () => {
    if (selectedPhotos.length === 0) return;
    try {
      const formData = new FormData();
      formData.append("tripId", trip._id);

      selectedPhotos.forEach((photo) => {
        formData.append("photos", photo.file);
        formData.append("captions", photo.caption);
      });

      await galleryService.uploadPhotos(formData);
      onUploaded();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0B0B] z-50 flex flex-col font-sans antialiased text-white select-none animate-in fade-in duration-200">
      
      {/* 1. Header Section Panel Row */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-stone-400">
          <ImageIcon size={16} className="text-[#2D6A4F]" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Upload to Gallery {selectedPhotos.length > 0 && `(${selectedPhotos.length}/20)`}
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="p-1.5 bg-white/5 border border-white/5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={15} />
        </button>
      </header>

      {/* 2. Central Main Display Area Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-0 overflow-hidden relative">
        {selectedPhotos.length > 0 ? (
          <div className="relative max-h-full max-w-full flex items-center justify-center p-2">
            <img
              src={selectedPhotos[activeIndex]?.preview}
              alt=""
              className="max-h-[50vh] max-w-[80vw] object-contain rounded-2xl shadow-2xl border border-white/5 animate-in zoom-in-95 duration-150"
            />
          </div>
        ) : (
          <label className="group cursor-pointer flex flex-col items-center text-center border border-dashed border-neutral-800 hover:border-neutral-700 bg-white/[0.01] hover:bg-white/[0.02] rounded-3xl p-12 transition-all duration-200 max-w-md w-full">
            <div className="p-4 bg-white/5 rounded-2xl text-stone-400 group-hover:text-white group-hover:scale-105 transition-all mb-4">
              <UploadCloud size={28} className="text-[#2D6A4F]" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-white mb-1">
              Select Trip Memories
            </h3>
            <p className="text-xs font-medium text-stone-500 max-w-[220px] leading-relaxed">
              Click to browse local image files. You can upload up to 20 media items at once.
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        )}
      </main>

      {/* 3. Subtitle / Caption Configuration Field */}
      {selectedPhotos.length > 0 && (
        <section className="px-6 py-4 flex justify-center bg-neutral-950/20 border-t border-neutral-900">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              value={selectedPhotos[activeIndex]?.caption || ""}
              onChange={(e) => updateCaption(activeIndex, e.target.value)}
              placeholder="Add a custom caption descriptor for this memory..."
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-[#2D6A4F] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-stone-500 outline-none transition-all"
            />
            {selectedPhotos[activeIndex]?.caption && (
              <button
                type="button"
                onClick={() => updateCaption(activeIndex, "")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* 4. Bottom Thumbnail Management Carousel Bar */}
      {selectedPhotos.length > 0 && (
        <footer className="border-t border-neutral-900 bg-neutral-950/40 backdrop-blur-xs px-6 py-4 min-h-[110px] flex items-center justify-between gap-6">
          
          {/* Scrollable Horizontal Thumbnail Carousel Grid */}
          <div className="flex-1 flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
            {selectedPhotos.map((photo, index) => {
              const isActive = activeIndex === index;
              return (
                <div key={index} className="relative shrink-0 group/thumb">
                  <img
                    src={photo.preview}
                    alt=""
                    onClick={() => setActiveIndex(index)}
                    className={`w-14 h-14 object-cover rounded-xl cursor-pointer transition-all duration-150 border ${
                      isActive
                        ? "border-[#2D6A4F] ring-2 ring-[#2D6A4F] scale-105 shadow-md shadow-[#2D6A4F]/10"
                        : "border-white/5 opacity-50 hover:opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md opacity-0 group-hover/thumb:opacity-100 transition-all duration-150 scale-90"
                    title="Remove item"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              );
            })}

            {/* Micro Inline Addition Row Trigger */}
            {selectedPhotos.length < 20 && (
              <label className="w-14 h-14 shrink-0 rounded-xl border border-dashed border-neutral-800 hover:border-neutral-700 bg-white/[0.01] hover:bg-white/[0.03] flex items-center justify-center text-stone-400 hover:text-white cursor-pointer transition-all duration-150">
                <Plus size={16} />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFiles}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Unified Dispatch Process Upload Action Trigger */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={uploadPhotos}
              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
            >
              Upload {selectedPhotos.length} {selectedPhotos.length === 1 ? "Item" : "Items"}
            </button>
          </div>

        </footer>
      )}

    </div>
  );
};

export default UploadPhotosModal;