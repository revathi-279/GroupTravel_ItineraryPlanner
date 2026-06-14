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

  if (!open) return null;

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
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0D0C] z-50 flex flex-col font-sans antialiased text-white select-none animate-in fade-in duration-200">
      
      {/* 1. Header Section */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-neutral-950/40">
        <div className="flex items-center gap-2 text-gray-400">
          <ImageIcon size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Upload to Gallery {selectedPhotos.length > 0 && `(${selectedPhotos.length}/20)`}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
        >
          <X size={18} />
        </button>
      </header>

      {/* 2. Central Main Display Area */}
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
          <label className="group cursor-pointer flex flex-col items-center text-center border border-dashed border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.03] rounded-3xl p-12 transition-all duration-200 max-w-md w-full">
            <div className="p-4 bg-white/5 rounded-2xl text-gray-400 group-hover:text-white group-hover:scale-105 transition-all mb-4">
              <UploadCloud size={28} />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-white mb-1">
              Select Trip Memories
            </h3>
            <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
              Click to browse files. You can select up to 20 images at once.
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

      {/* 3. Subtitle / Caption Layer */}
      {selectedPhotos.length > 0 && (
        <section className="px-6 py-4 flex justify-center bg-neutral-950/20 border-t border-white/5">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              value={selectedPhotos[activeIndex]?.caption || ""}
              onChange={(e) => updateCaption(activeIndex, e.target.value)}
              placeholder="Add a custom caption for this memory..."
              className="w-full bg-white/5 border border-white/5 focus:border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white placeholder-gray-500 outline-none transition-all focus:bg-white/[0.08]"
            />
            {selectedPhotos[activeIndex]?.caption && (
              <button
                onClick={() => updateCaption(activeIndex, "")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* 4. Bottom Thumbnail Management Bar */}
      {selectedPhotos.length > 0 && (
        <footer className="border-t border-white/5 bg-neutral-950/60 px-6 py-4 min-h-[110px] flex items-center justify-between gap-6">
          
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
                        ? "ring-2 ring-[#1E4631] scale-105 border-transparent shadow-md"
                        : "border-white/5 opacity-60 hover:opacity-100"
                    }`}
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-md opacity-0 group-hover/thumb:opacity-100 transition-all scale-75 group-hover/thumb:scale-100"
                    title="Remove image"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              );
            })}

            {/* Micro Inline Addition Handle */}
            {selectedPhotos.length < 20 && (
              <label className="w-14 h-14 shrink-0 rounded-xl border border-dashed border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-all duration-150">
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

          {/* Unified Dispatch Process Upload Button */}
          <div className="shrink-0">
            <button
              onClick={uploadPhotos}
              className="bg-[#1E4631] hover:bg-[#153122] text-white px-5 py-3 rounded-xl text-xs font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
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