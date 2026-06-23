import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPinned, 
  Utensils, 
  Backpack, 
  CloudSun, 
  AlertTriangle 
} from "lucide-react";

const Section = ({ icon, title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="select-none animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2 mb-3.5">
        <div className="text-[#2D6A4F]">{icon}</div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          {title}
        </h3>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="text-xs font-semibold text-slate-700 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl p-3.5 leading-relaxed shadow-2xs"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const TravelInsightsDrawer = ({ open, onClose, insights }) => {
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] overflow-hidden font-sans antialiased text-slate-900">
          
          {/* 1. Backdrop layer protecting color temperature warmth */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs w-full h-full cursor-pointer"
          />

          {/* 2. Sliding Panel Content Sheet Box - Pure White Base */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="absolute right-0 top-0 bottom-0 h-screen w-full sm:w-[520px] bg-white border-l border-[#EFE9DC] shadow-2xl flex flex-col overflow-hidden"
          >
            
            {/* Header Control Row */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5F0E6] bg-white select-none flex-shrink-0">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                Travel Insights
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Display Scroll Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scrollbar-thin">
              
              <Section
                icon={<MapPinned size={15} />}
                title="Recommended Places"
                items={insights?.places}
              />

              <Section
                icon={<Utensils size={15} />}
                title="Food To Try"
                items={insights?.food}
              />

              <Section
                icon={<Backpack size={15} />}
                title="Packing Tips"
                items={insights?.packing}
              />

              <Section
                icon={<CloudSun size={15} />}
                title="Weather Notes"
                items={insights?.weather}
              />

              <Section
                icon={<AlertTriangle size={15} className="text-rose-500" />}
                title="Travel Warnings"
                items={insights?.warnings}
              />

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TravelInsightsDrawer;