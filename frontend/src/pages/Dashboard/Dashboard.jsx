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

import { weatherService }
from "../../services/weatherService"

import WeatherCard
from "../../components/dashboard/WeatherCard";

import { Compass, Search } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  const [
  weather,
  setWeather
] = useState(null);
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
      if (
  tripsResponse.trips?.length
) {

  const activeTrip =
    tripsResponse.trips.find(
      trip => {

        const today =
          new Date();

        return (
          today >=
            new Date(
              trip.startDate
            ) &&
          today <=
            new Date(
              trip.endDate
            )
        );

      }
    );

  if (activeTrip) {

    const weatherResponse =
      await weatherService
        .getWeather(
          activeTrip._id
        );

    setWeather(
      weatherResponse
    );
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

  const isSearching =
  search.trim() !== "";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-gray-950 pb-20">
      
      {/* Global Pinned Header Pipeline */}
      <header className="bg-white border-b border-gray-200/60 sticky top-0 z-40">
        <DashboardNavbar 
          search={search} 
          setSearch={setSearch} 
          onCreateTrip={() => setShowCreateModal(true)} 
        />
      </header>

      {/* Main Structural Framework Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* Mobile View Input Display: Fallback search if screen viewport is narrow */}
        <div className="relative block md:hidden w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search journeys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none text-gray-800"
          />
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Top Insight Split Container Row Grid */}
            {!isSearching &&
 (pendingInvitation ||
  activeTrip ||
  upcomingTrip) && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col justify-between">
                  {/* Internal components will inherit background hex #1E4631 cleanly */}
                  <AttentionCenter
                    pendingInvitation={pendingInvitation}
                    activeTrip={activeTrip}
                    upcomingTrip={upcomingTrip}
                    onRefresh={fetchDashboardData}
                    onCreateTripClick={() => setShowCreateModal(true)}
                  />
                </div>
                
                {activeTrip &&
 weather && (
  <div
  className="
  lg:col-span-4
  "
>

  <WeatherCard
    weather={weather}
      tripId={activeTrip._id}
  />
  </div>

)}
              </section>
            )}

            {/* Content Journeys Grid Container */}
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <Compass size={16} className="text-[#1E4631]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    Your Journeys
                  </h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md">
                    {filteredTrips.length}
                  </span>
                </div>
              </div>

             {filteredTrips.length === 0 ? (

  isSearching ? (

    <div
      className="
      bg-white
      border
      border-gray-200/60
      rounded-2xl
      p-16
      text-center
      "
    >

      <h3
        className="
        text-xl
        font-semibold
        text-gray-800
        "
      >
        No Trips Found
      </h3>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        No journeys match
        "{search}"
      </p>

    </div>

  ) : (

    <div
      className="
      bg-white
      border
      border-gray-200/60
      border-dashed
      rounded-2xl
      p-12
      text-center
      shadow-xs
      "
    >
      <EmptyState
        onCreateClick={() =>
          setShowCreateModal(true)
        }
      />
    </div>

  )

) : (

  <TripGrid
    trips={filteredTrips}
  />

)}
            </section>
          </>
        )}
      </main>

      {/* Primary Global Context Create Modal Drawer */}
      <CreateTripModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  );
};

export default Dashboard;