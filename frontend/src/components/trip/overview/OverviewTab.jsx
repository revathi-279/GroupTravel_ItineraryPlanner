import MembersCard from "../members/MembersCard";
import RecentUpdatesCard from "./RecentUpdatesCard";
import UpcomingEventCard from "./UpcomingEventCard";
import WeatherStatusCard from "./WeatherStatusCard";
import TravelInsightsCard from "./TravelInsightsCard";

const OverviewTab = ({
  trip,
  currentUser,
  refreshTrip,
  onViewEvent
}) => {

  const handleViewEvent = (event) => {
    onViewEvent?.(event);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full align-start">
      
      {/* LEFT COLUMN: Crew details & recent timeline streams */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <MembersCard
          trip={trip}
          currentUser={currentUser}
          refreshTrip={refreshTrip}
        />

        <RecentUpdatesCard
          trip={trip}
          currentUser={currentUser}
        />
      </div>

      {/* RIGHT COLUMN: Live trip tracking, meteorology, & advisory boards */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <UpcomingEventCard
          trip={trip}
          onViewEvent={handleViewEvent}
        />

        <WeatherStatusCard
          trip={trip}
        />

        <TravelInsightsCard
          trip={trip}
        />
      </div>

    </div>
  );
};

export default OverviewTab;