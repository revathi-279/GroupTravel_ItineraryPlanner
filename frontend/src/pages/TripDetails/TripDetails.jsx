import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import { tripService }
from "../../services/tripService";

import TripSidebar
from "../../components/trip/workspace/TripSidebar";
import OverviewTab
from "../../components/trip/overview/OverviewTab";

import ItineraryTab
from "../../components/trip/itinerary/ItineraryTab";

import ExpensesTab
from "../../components/trip/expenses/ExpensesTab";

import PollsTab from "../../components/trip/polls/PollsTab";

import GalleryTab
from "../../components/trip/gallery/GalleryTab";

import { theme }
from "../../common/common";

import { useAuth }
from "../../context/AuthContext";

const TripDetails = () => {

  const { user } = useAuth();

  const { tripId } =
    useParams();

  const [trip, setTrip] =
    useState(null);

  const [statistics,
    setStatistics] =
    useState(null);

  const [activeTab,
setActiveTab] =
useState(() => {

  return (
    localStorage.getItem(
      "tripActiveTab"
    ) || "Overview"
  );

});



  useEffect(() => {

  localStorage.setItem(
    "tripActiveTab",
    activeTab
  );

}, [activeTab]);

const fetchTripData =
async () => {

  try {

    const [
      tripResponse,
      statisticsResponse,
    ] = await Promise.all([

      tripService.getTrip(
        tripId
      ),

      tripService.getTripStatistics(
        tripId
      ),

    ]);

    setTrip(
      tripResponse.trip
    );

    setStatistics(
      statisticsResponse.statistics
    );

  } catch (error) {

    console.log(error);
  }
};

useEffect(() => {

  fetchTripData();

}, [tripId]);

  if (
    !trip ||
    !statistics
  ) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  console.log("TRIP DATA");
console.log(trip);
console.log("ADMINS", trip?.admins);
console.log("MEMBERS", trip?.members);

 return (

<div
  className="
  h-screen
  bg-[#FAF6ED]
  flex
  overflow-hidden
  "
>

 <TripSidebar
  trip={trip}
  statistics={statistics}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  currentUser={user}
/>

  <main
    className="
    flex-1
    overflow-y-auto
    px-10
    py-8
    "
  >

    {activeTab ===
    "Overview" && (

      <OverviewTab
  trip={trip}
  statistics={statistics}
  currentUser={user}
  refreshTrip={
    fetchTripData
  }
/>
    )}

    {activeTab ===
    "Itinerary" && (

      <ItineraryTab
        trip={trip}
        currentUser={user}
      />

    )}

    {activeTab ===
    "Expenses" && (

      <ExpensesTab
        trip={trip}
        currentUser={user}
      />

    )}

    {activeTab ===
    "Gallery" && (

      <GalleryTab
        trip={trip}
        currentUser={user}
      />

    )}

    {activeTab ===
    "Polls" && (

      <PollsTab
        trip={trip}
        currentUser={user}
      />

    )}

  </main>

</div>

);
};

export default TripDetails;