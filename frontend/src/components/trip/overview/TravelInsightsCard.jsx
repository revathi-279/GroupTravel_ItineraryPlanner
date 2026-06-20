import {
  useEffect,
  useState
}
from "react";

import {
  Sun,
  MapPinned,
  Bus,
  Utensils,
  Hotel,
  Backpack
}
from "lucide-react";

import {
  aiService
}
from "../../../services/aiService";

import TravelInsightsDrawer
from "./TravelInsightsDrawer";

const TravelInsightsCard = ({
  trip
}) => {

  const [
    insights,
    setInsights
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
  showDrawer,
  setShowDrawer
] = useState(false);

  
  const loadInsights =
async (
  forceRefresh = false
) => {

  try {

    setLoading(true);

    const response =
      forceRefresh
        ? await aiService
            .refreshTripInsights(
              trip._id
            )
        : await aiService
            .getTripInsights(
              trip._id
            );

  setInsights(
  response.insights || {}
);
  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

};




  useEffect(() => {

  loadInsights();

}, [trip]);

  const getIcon =
  (type) => {

    switch(type) {

      case "weather":
        return <Sun size={18} />;

      case "attraction":
        return <MapPinned size={18} />;

      case "transport":
        return <Bus size={18} />;

      case "food":
        return <Utensils size={18} />;

      case "stay":
        return <Hotel size={18} />;

      case "packing":
        return <Backpack size={18} />;

      default:
        return <Sun size={18} />;

    }

  };

  return (

    <div
      className="
      bg-white
      border
      border-gray-200/60
      rounded-2xl
      p-6
      h-full
      "
    >

     <div
  className="
  flex
  items-center
  justify-between
  mb-5
  "
>

  <h3
    className="
    text-xs
    uppercase
    tracking-widest
    font-bold
    text-gray-400
    "
  >
    Travel Insights
  </h3>

  <button
  onClick={() =>
    loadInsights(true)
  }
  disabled={loading}
  className="
  text-xs
  font-semibold
  text-[#1E4631]
  hover:underline
  "
>
  Refresh
</button>

</div>

      {loading && (

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          Generating insights...
        </p>

      )}

      {!loading &&
       insights.length === 0 && (

        <p
          className="
          text-sm
          text-gray-500
          "
        >
          No insights available.
        </p>

      )}

      <div
        className="
        space-y-3
        "
      >

        {insights.quickInsights?.map(
          (
            insight,
            index
          ) => (

            <div
              key={index}
              className="
              flex
              gap-3
              p-3
              rounded-xl
              bg-gray-50
              "
            >

              <div
                className="
                text-[#2F6F4E]
                mt-0.5
                "
              >
                {getIcon(
                  insight.type
                )}
              </div>

              <div>

                <h4
                  className="
                  text-sm
                  font-semibold
                  text-gray-900
                  "
                >
                  {insight.title}
                </h4>

                <p
                  className="
                  text-xs
                  text-gray-500
                  mt-1
                  "
                >
                  {insight.description}
                </p>

              </div>

            </div>

          )
        )}

      </div>

      <div
  className="
  pt-4
  mt-4
  border-t
  border-gray-100
  "
>

  <button
    onClick={() =>
      setShowDrawer(
        true
      )
    }
    className="
    text-sm
    font-semibold
    text-[#1E4631]
    hover:underline
    "
  >
    View Detailed Insights →
  </button>

</div>

<TravelInsightsDrawer
  open={showDrawer}
  onClose={() =>
    setShowDrawer(false)
  }
  insights={
    insights.detailedInsights
  }
/>

    </div>

  );

};

export default TravelInsightsCard;