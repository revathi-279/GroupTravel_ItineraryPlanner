import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  AlertTriangle
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const WeatherCard = ({
  weather,
  tripId
}) => {

  const navigate = useNavigate();
  const hasAlert = weather?.alerts?.length > 0;

  return (
    <div className="bg-gradient-to-b from-white to-[#FDFBF7] border border-[#EFE9DC] rounded-3xl p-6 h-full flex flex-col justify-between shadow-xs">
      <div>
        {hasAlert && (
          <div className="mb-4 pb-4 border-b border-rose-100">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-rose-600">
                  Weather Alert
                </p>
                <h4 className="text-xs font-semibold text-slate-800 mt-0.5">
                  {weather.destination}
                </h4>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400">
            Weather
          </h3>
          <img
            src={weather.current.icon}
            alt=""
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Scaled back down to your original look to match layout hierarchy perfectly */}
        <h2 className="text-4xl font-bold text-slate-800 tracking-tight mt-1">
          {Math.round(weather.current.temperature)}°C
        </h2>

        {/* Premium subtle pastel highlight badge for condition info */}
        <div className="mt-3">
          <span className="text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-100 rounded-lg px-2.5 py-1 inline-block">
            {weather.current.condition}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/trip/${tripId}`)}
        className="mt-6 self-start text-sm font-bold text-[#2D6A4F] hover:text-[#1B4332] inline-flex items-center gap-1 transition-colors"
      >
        View Details →
      </button>
    </div>
  );
};

export default WeatherCard;