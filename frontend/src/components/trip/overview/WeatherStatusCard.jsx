import { useEffect, useState } from "react";
import { theme } from "../../../common/common";
import { weatherService } from "../../../services/weatherService";
import { CloudSun, AlertTriangle, Wind } from "lucide-react";

const WeatherStatusCard = ({ trip }) => {
  const [weather, setWeather] = useState(null);
  const [showWeather, setShowWeather] = useState(false);

  useEffect(() => {
    const startDate = new Date(trip.startDate);
    const today = new Date();
    
    const daysUntilTrip = Math.ceil(
      (startDate - today) / (1000 * 60 * 60 * 24)
    );

    const tripStarted = today >= new Date(trip.startDate);
    const shouldShow = tripStarted || daysUntilTrip <= 3;

    setShowWeather(shouldShow);

    if (!shouldShow) return;

    const load = async () => {
      try {
        const response = await weatherService.getWeather(trip._id);
        setWeather(response);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [trip]);

  useEffect(() => {
    const scrollTarget = localStorage.getItem("scrollToWeather");

    if (scrollTarget === "true") {
      // Note: If you need to change the active sidebar tab frame context from here, 
      // make sure to pass setActiveTab down into this component as a prop!
      setTimeout(() => {
        document.getElementById("weather-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 300);

      localStorage.removeItem("scrollToWeather");
    }
  }, [trip]);

  // Fallback: Forecast Not Yet Available State
  if (!showWeather) {
    return (
      <div className="bg-white border border-[#EFE9DC] rounded-3xl p-6 font-sans antialiased text-slate-900">
        <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-5 select-none">
          Trip Weather
        </h3>

        <div className="text-center py-8">
          <div className="w-12 h-12 bg-[#FAF8F5] border border-[#EFE9DC] rounded-xl flex items-center justify-center mx-auto mb-4">
            <CloudSun size={22} className="text-stone-400" />
          </div>
          <p className="text-xs font-semibold text-stone-400 max-w-[200px] mx-auto leading-relaxed">
            Forecast available 3 days before departure
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="weather-section"
      className="bg-white border border-[#EFE9DC] rounded-3xl p-6 font-sans antialiased text-slate-900"
    >
      <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-5 select-none">
        Trip Weather
      </h3>

      {/* Weather Warning Notification Row */}
      {weather && weather.alerts?.length > 0 && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-150">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-rose-500 leading-none mb-1">
              Active Weather Alert
            </p>
            <p className="leading-snug">
              Severe conditions reported near {trip.destination}. Check local updates.
            </p>
          </div>
        </div>
      )}

      {weather && (
        <>
          {/* Main Temperature Display */}
          <div className="flex items-center gap-4 select-none">
            <div className="w-14 h-14 bg-[#FAF8F5] border border-[#EFE9DC] rounded-2xl flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
              <img
                src={weather.current.icon}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-none">
                {Math.round(weather.current.temperature)}°C
              </h2>
              <p className="text-xs font-semibold text-stone-400 mt-1">
                {weather.current.condition}
              </p>
            </div>
          </div>

          {/* Meteorological Metric Rows */}
          <div className="mt-6 space-y-2.5 text-xs font-semibold text-stone-500">
            <div className="flex justify-between items-center py-1.5 border-b border-[#FAF8F5]">
              <span className="text-stone-400">Feels Like</span>
              <span className="text-slate-700">{Math.round(weather.current.feelsLike)}°C</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#FAF8F5]">
              <span className="text-stone-400">Humidity</span>
              <span className="text-slate-700">{weather.current.humidity}%</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-stone-400">Wind Speed</span>
              <span className="text-slate-700 flex items-center gap-1">
                <Wind size={12} className="text-stone-300" />
                {weather.current.windSpeed} km/h
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherStatusCard;