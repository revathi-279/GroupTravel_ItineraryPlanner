import { useEffect, useState } from "react";
import { tripService } from "../../services/tripService";
import { notificationService } from "../../services/notificationService";
import { theme } from "../../common/common";

import DashboardNavbar from "../../components/dashboard/DashboardNavbar";
import TripGrid from "../../components/dashboard/TripGrid";
import EmptyState from "../../components/dashboard/EmptyState";
import AttentionCenter from "../../components/dashboard/AttentionCenter";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import CreateTripModal from "../../components/dashboard/CreateTripModal";

import { weatherService } from "../../services/weatherService";
import WeatherCard from "../../components/dashboard/WeatherCard";

import { useNavigate } from "react-router-dom";

import { Compass, Search } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tripsResponse, notificationsResponse] = await Promise.all([
        tripService.getTrips(),
        notificationService.getNotifications(),
      ]);
      setTrips(tripsResponse.trips || []);
      setFilteredTrips(tripsResponse.trips || []);
      
      if (tripsResponse.trips?.length) {
        const activeTrip = tripsResponse.trips.find(trip => {
          const today = new Date();
          return (
            today >= new Date(trip.startDate) &&
            today <= new Date(trip.endDate)
          );
        });

        if (activeTrip) {
          const weatherResponse = await weatherService.getWeather(activeTrip._id);
          setWeather(weatherResponse);
        }
      }
      setNotifications(notificationsResponse.notifications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = trips.filter(
      (trip) =>
        trip.title?.toLowerCase().includes(query) ||
        trip.destination?.toLowerCase().includes(query)
    );
    setFilteredTrips(filtered);
  }, [search, trips]);

  const upcomingTrip = trips.find((trip) => new Date(trip.startDate) > new Date());
  const pendingInvitation = notifications.find(
    (n) => n.type === "trip_invitation" && n.status === "pending"
  );
  const activeTrip = trips.find((trip) => {
    const today = new Date();
    return today >= new Date(trip.startDate) && today <= new Date(trip.endDate);
  });

  const handleTripCreated = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setFilteredTrips((prev) => [newTrip, ...prev]);
  };

  const isSearching = search.trim() !== "";

  return (
    // Replaced plain #FAFAFA with a premium light sandalwood multi-tone gradient system
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F9F6F0] to-[#F3EFE6] font-sans antialiased text-slate-900 pb-20">
      
      {/* Premium Translucent Header Area */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#EFE9DC] sticky top-0 z-40 shadow-xs">
        <DashboardNavbar 
          search={search} 
          setSearch={setSearch} 
          onCreateTrip={() => setShowCreateModal(true)} 
        />
      </header>

      {/* Main Framework Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* Mobile Filter Input Bar */}
        <div className="relative block md:hidden w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search journeys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-[#EFE9DC] rounded-xl text-sm outline-none text-slate-800 focus:border-[#2D6A4F] focus:bg-white transition-all shadow-xs"
          />
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Top Row Split Grid Component Block */}
            {!isSearching && (pendingInvitation || activeTrip || upcomingTrip) && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <AttentionCenter
                    pendingInvitation={pendingInvitation}
                    activeTrip={activeTrip}
                    upcomingTrip={upcomingTrip}
                    onRefresh={fetchDashboardData}
                    onCreateTripClick={() => setShowCreateModal(true)}
                     onOpenTrip={(tripId) =>
    navigate(`/trip/${tripId}`)
  }
                  />
                </div>
                
                {activeTrip && weather && (
                  <div className="lg:col-span-4 flex flex-col">
                    <WeatherCard
                      weather={weather}
                      tripId={activeTrip._id}
                    />
                  </div>
                )}
              </section>
            )}

            {/* Journeys Collection Grid Wrap */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFE9DC] pb-3">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-[#2D6A4F]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Your Journeys
                  </h2>
                  <span className="bg-[#EFE9DC] text-[#2D6A4F] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {filteredTrips.length}
                  </span>
                </div>
              </div>

              {filteredTrips.length === 0 ? (
                isSearching ? (
                  <div className="bg-white border border-[#EFE9DC] rounded-2xl p-16 text-center shadow-xs">
                    <h3 className="text-lg font-semibold text-slate-800">No Trips Found</h3>
                    <p className="text-sm text-stone-500 mt-1">
                      No journeys match "{search}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/40 border border-[#EFE9DC] border-dashed rounded-2xl p-12 text-center shadow-xs">
                    <EmptyState onCreateClick={() => setShowCreateModal(true)} />
                  </div>
                )
              ) : (
                <TripGrid trips={filteredTrips} />
              )}
            </section>
          </>
        )}
      </main>

      {/* Global Framework Form Handler Modal */}
      <CreateTripModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  );
};

export default Dashboard;