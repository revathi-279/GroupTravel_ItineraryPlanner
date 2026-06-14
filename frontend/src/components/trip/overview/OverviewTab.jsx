import MembersCard
from "../members/MembersCard";

import RecentUpdatesCard
from "./RecentUpdatesCard";

const OverviewTab = ({
  trip,
  currentUser,
  refreshTrip
}) => {

  return (

    <div
      className="
      grid
      grid-cols-1
      lg:grid-cols-12
      gap-6
      "
    >

      <div
        className="
        lg:col-span-5
        "
      >
       <MembersCard
  trip={trip}
  currentUser={currentUser}
  refreshTrip={refreshTrip}
/>
      </div>

      <div
        className="
        lg:col-span-7
        "
      >
       <RecentUpdatesCard trip={trip} />
      </div>

    </div>

  );
};

export default OverviewTab;