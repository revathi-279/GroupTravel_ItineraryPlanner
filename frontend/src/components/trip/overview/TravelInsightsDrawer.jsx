import { X } from "lucide-react";

import {
  MapPinned,
  Utensils,
  Backpack,
  CloudSun,
  AlertTriangle
}
from "lucide-react";

import { motion, AnimatePresence }
from "framer-motion";

const Section = ({
  icon,
  title,
  items
}) => {

  if (
    !items ||
    items.length === 0
  ) {
    return null;
  }

  return (

    <div>

      <div
        className="
        flex
        items-center
        gap-2
        mb-3
        "
      >

        {icon}

        <h3
          className="
          font-semibold
          text-[#1E4631]
          "
        >
          {title}
        </h3>

      </div>

      <div
        className="
        space-y-2
        "
      >

        {items.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              className="
              text-sm
              text-gray-600
              bg-[#F7F9F8]
              border
              border-[#E8EFEA]
              rounded-xl
              p-3
              "
            >
              {item}
            </div>

          )
        )}

      </div>

    </div>

  );

};
const TravelInsightsDrawer = ({
  open,
  onClose,
  insights
}) => {

  return (

    <AnimatePresence>

    {open && (

    <>

     <motion.div
  onClick={onClose}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="
  fixed
  inset-0
  bg-black/40
  z-40
  "
/>

      <motion.div
  initial={{
    x: "100%"
  }}
  animate={{
    x: 0
  }}
  exit={{
    x: "100%"
  }}
  transition={{
    duration: 0.25,
    ease: "easeOut"
  }}
  className="
  fixed
  right-0
  top-0
  h-screen
  w-[520px]
  bg-white
  shadow-2xl
  z-50
  flex
  flex-col
  "
>

        <div
          className="
          flex
          items-center
          justify-between
          p-6
          border-b
          "
        >

          <h2
            className="
            text-lg
            font-bold
            "
          >
            Travel Insights
          </h2>

          <button
            onClick={onClose}
          >
            <X size={20}/>
          </button>

        </div>

        <div
          className="
          flex-1
          overflow-y-auto
          p-6
          space-y-8
          "
        >

          <Section
  icon={
    <MapPinned
      size={18}
      className="text-[#1E4631]"
    />
  }
  title="Recommended Places"
  items={insights?.places}
/>

<Section
  icon={
    <Utensils
      size={18}
      className="text-[#1E4631]"
    />
  }
  title="Food To Try"
  items={insights?.food}
/>

<Section
  icon={
    <Backpack
      size={18}
      className="text-[#1E4631]"
    />
  }
  title="Packing Tips"
  items={insights?.packing}
/>

<Section
  icon={
    <CloudSun
      size={18}
      className="text-[#1E4631]"
    />
  }
  title="Weather Notes"
  items={insights?.weather}
/>

<Section
  icon={
    <AlertTriangle
      size={18}
      className="text-amber-500"
    />
  }
  title="Travel Warnings"
  items={insights?.warnings}
/>

        </div>

      </motion.div>

    </>

     )}

  </AnimatePresence>

  );

};

export default TravelInsightsDrawer;