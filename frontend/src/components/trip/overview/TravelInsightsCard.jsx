import { useEffect, useState } from "react";
import { theme } from "../../../common/common";
import { aiService } from "../../../services/aiService";
import TravelInsightsDrawer from "./TravelInsightsDrawer";
import { 
  Sun, 
  MapPinned, 
  Bus, 
  Utensils, 
  Hotel, 
  Backpack, 
  Loader2, 
  Sparkles 
} from "lucide-react";

const TravelInsightsCard = ({ trip }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const loadInsights = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const response = forceRefresh
        ? await aiService.refreshTripInsights(trip._id)
        : await aiService.getTripInsights(trip._id);

      setInsights(response.insights || {});
    } catch (error) {
      console.log(error);
    } {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [trip]);

  const getIcon = (type) => {
    switch(type) {
      case "weather":
        return <Sun size={15} />;
      case "attraction":
        return <MapPinned size={15} />;
      case "transport":
        return <Bus size={15} />;
      case "food":
        return <Utensils size={15} />;
      case "stay":
        return <Hotel size={15} />;
      case "packing":
        return <Backpack size={15} />;
      default:
        return <Sun size={15} />;
    }
  };

  return (
    <div className="bg-white border border-[#EFE9DC] rounded-3xl p-6 h-full flex flex-col font-sans antialiased text-slate-900">
      
      {/* Card Header Row */}
      <div className="flex items-center justify-between mb-5 select-none flex-shrink-0">
        <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400">
          Travel Insights
        </h3>

        <button
          onClick={() => loadInsights(true)}
          disabled={loading}
          className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] disabled:opacity-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center">
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-stone-400">
            <Loader2 size={20} className="animate-spin text-[#2D6A4F]" />
            <span className="text-xs font-semibold">Generating smart insights...</span>
          </div>
        )}

        {!loading && (!insights.quickInsights || insights.quickInsights.length === 0) && (
          <div className="py-12 text-center select-none">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EFE9DC] flex items-center justify-center mx-auto mb-3">
              <Sparkles size={18} className="text-stone-400" />
            </div>
            <p className="text-xs font-semibold text-stone-400">
              No insights generated for this route yet.
            </p>
          </div>
        )}

        {!loading && insights.quickInsights?.length > 0 && (
          <div className="space-y-3">
            {insights.quickInsights.map((insight, index) => (
              <div
                key={index}
                className="flex gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE9DC]/40"
              >
                <div className="text-[#2D6A4F] mt-0.5 flex-shrink-0">
                  {getIcon(insight.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-normal">
                    {insight.title}
                  </h4>
                  <p className="text-[11px] font-medium text-stone-400 mt-0.5 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Drawer Activation Bar */}
      {!loading && insights.quickInsights?.length > 0 && (
        <div className="pt-4 mt-5 border-t border-[#F5F0E6] flex-shrink-0">
          <button
            onClick={() => setShowDrawer(true)}
            className="text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
          >
            View Detailed Insights →
          </button>
        </div>
      )}

      <TravelInsightsDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        insights={insights.detailedInsights}
      />
    </div>
  );
};

export default TravelInsightsCard;